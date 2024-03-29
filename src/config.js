import React, { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ConfigWrapper } from './style';
import { Dragger, DropBoard, Dropper } from './common';
import styled from '@emotion/styled';

const PopoverWrapper = styled.div`
	width: 500px;
	/* .-txt {
		font-size: 16px;
		font-weight: bold;
	} */

	img {
		width: 100%;
	}
`;

const NoInfo = () => {
	return (
		<div className={'color-red'} style={{ paddingTop: 5 }}>
			<i className={'fa fa-fw fa-exclamation-circle'} />a
		</div>
	);
};

export const SummaryConfig = forwardRef(({
	formFields,
	standardFields,
	stickySummary,
	floatSummary,
	setStickySummary = () => {},
	setFloatSummary = () => {}
}, ref) => {

	const values = useMemo(() => {
		return {
			stickySummary,
			floatSummary
		};
	}, [stickySummary, floatSummary]);

	const setValues = {
		stickySummary: setStickySummary,
		floatSummary: setFloatSummary
	};
	const [onDragList, setOnDragList] = useState(null);
	const [isDragOutId, setIsDragOutId] = useState(null);

	const setLists = (value, listName) => {
		setValues[listName](value);
	};

	const dataMap = useMemo(() => {
		return {
			formField: formFields,
			standardField: standardFields,
			// 'variable': originData
		};
	}, [standardFields, formFields]);

	const [currentDragList, setCurrentDragList] = useState(false);

	// const disable = useMemo(() => {
	// 	return onDragList && (onDragList !== 'floatSummary');
	// }, [onDragList]);

	return (
		<DragDropContext
			onBeforeCapture={(beforeCapture) => {
				const listName = beforeCapture.draggableId.match(/\[([^\]]+)\]/)[1].split('-')[0];
				if (values[listName]) {
					setOnDragList(listName);
				}
			}}
      // onBeforeCapture={(start) => {
      //   const listName = start.draggableId.match(/\[([^\]]+)\]/)[1].split('-')[0];
			// 	if (values[listName]) {
			// 		setOnDragList(listName);
			// 	}
      // }}
			onDragStart={(start) => {
				// 重複設一次，上一步沒辦法更動disable的狀態很奇怪
				const listName = start.draggableId.match(/\[([^\]]+)\]/)[1].split('-')[0];
				if (values[listName]) {
					setCurrentDragList(listName);
				}
			}}
			onDragUpdate={(update, provided) => {
				const { source, draggableId } = update;
				// 往外拖曳並關閉動畫
				if (source.droppableId && !source.destination) {
					setIsDragOutId(draggableId);
				} else {
					setIsDragOutId(null);
				}
			}}
			onDragEnd={(result) => {
				const { source, destination, draggableId } = result;

				// 拖曳至外部
				if (source.droppableId && values[source.droppableId] && !destination) {
					const newList = [...values[source.droppableId]];

					newList.splice(source.index, 1);
					setLists(newList, source.droppableId);
				}

				setOnDragList(null);
				setCurrentDragList(null);

				if (!destination) return;

				if (destination.droppableId && destination.droppableId.slice(-7) !== 'remover') {
					const newList = [...values[destination.droppableId]];
					const currentId = draggableId.split(']')[1];

					if (source.droppableId !== destination.droppableId) {
						const name = dataMap[source.droppableId].find(x => x.value.toString() === currentId).name;
						// 外部插入
						newList.splice(destination.index, 0, {
							name,
							value: currentId,
							type: source.droppableId
						});
					} else {
						// 交換位置
						const [removed] = newList.splice(source.index, 1);
						newList.splice(destination.index, 0, removed);
					}

					setLists(newList, destination.droppableId);
				}

				if (source.droppableId && destination.droppableId.slice(-7) === 'remover') {
					const newList = [...values[source.droppableId]];
					newList.splice(source.index, 1);
					setLists(newList, source.droppableId);
				}
			}}
		>
			<ConfigWrapper className='form-horizontal'>
				<div className='form-group -fields'>
					<label className='control-label col-xs-3'>標準欄位</label>
					<div className="col-xs-18">
						<Dropper data={dataMap.standardField} id='standardField' isDropDisabled={true}>
							{
								!dataMap.standardField.length ? <NoInfo /> : null
							}
						</Dropper>
					</div>
				</div>
				<div className="form-group -fields">
					<label className='control-label col-xs-3'>表單欄位</label>
					<div className="col-xs-18">
						<Dropper data={dataMap.formField} id='formField' isDropDisabled={true}>
							{
								!dataMap.formField.length ? <NoInfo /> : null
							}
						</Dropper>
					</div>
				</div>
				<div className='divider'></div>
				<DropBoard
					id='stickySummary'
					title='表單簽核列表的摘要資訊'
					tip={(
						<PopoverWrapper>
							<div className='-txt'>可設定表單簽核列表的「摘要資訊」。譬如若設定【數值計算】，則呈現如下圖所示。</div>
							<img src="img/custom-form/fix-summary-popover.png" alt="popover" />
						</PopoverWrapper>
					)}
					value={values.stickySummary}
					setValue={(v) => {
						setLists(v, 'stickySummary');
					}}
					onDragList={onDragList}
					currentDragList={currentDragList}
					isDragOutId={isDragOutId}
					// isDropDisabled={onDragList && onDragList !== 'stickySummary'}
				/>
				<DropBoard
					id='floatSummary'
					title='浮動式摘要'
					tip={(
						<PopoverWrapper>
							<div className='-txt'>可設定「浮動式摘要」。譬如若由上而下設定【申請人】【部門名稱】【數值計算】，則呈現如下圖所示。</div>
							<img src="img/custom-form/float-summary-popover.png" alt="popover" />
						</PopoverWrapper>
					)}
					value={values.floatSummary}
					setValue={(v) => {
						setLists(v, 'floatSummary');
					}}
					onDragList={onDragList}
					currentDragList={currentDragList}
					isDragOutId={isDragOutId}
					// isDropDisabled={onDragList && onDragList !== 'floatSummary'}
				/>
			</ConfigWrapper>
		</DragDropContext>

	);
});