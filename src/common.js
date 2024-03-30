import React, { createContext, forwardRef, useContext, useEffect, useState } from 'react';
import { Droppable, Draggable } from './dnd';
// import { Droppable, Draggable } from 'react-beautiful-dnd'


export const InputTip = ({ msg }) => {
    return null;
};

const ClickContext = createContext({
	onClick: () => {}
});

const DragElement = forwardRef(({ children, snapshot, isDragOutId, className, anitmation, id, ...props }, ref) => {
	let style = props.style;
	if (!props.style?.position && !anitmation) {
		style = {};
	}
	if (id === isDragOutId) {
		if (snapshot && snapshot.isDropAnimating && snapshot.isDragging && !snapshot.draggingOver) {
			style = {
				...style,
				transitionDuration: `0.001s`,
				opacity: 0,
			};
		}
	}

	return <div
		className={'drag-box' + (className ? ' ' + className : '')}
		{...props}
		ref={ref}
		style={style}
	>
		{children}
	</div>;
});

export const Dragger = ({ children, id, index, type, anitmation, isDragOutId }) => {
	const { onClick } = useContext(ClickContext);

	return <Draggable draggableId={id} index={index}>
		{(provided, snapshot) => {

			return (
				<>
					<DragElement
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						anitmation={anitmation}
						data-type={type}
						id={id}
						isDragOutId={isDragOutId}
						snapshot={snapshot}
						onClick={() => {
							onClick?.(id, type);
						}}
					>{children}</DragElement>
					{/* {
						snapshot.isDragging && !anitmation && (
							<DragElement data-type={type} className='-copy'>
								{children}
							</DragElement>
						)
					} */}
				</>
			);
		}}
	</Draggable>;
};

export const Dropper = ({ data = [], onClick, isDragOutId, children, id, anitmation = false, onDrag, isDropDisabled, ...props }) => {
  // const [key, setKey] = useState(1)
  // useEffect(() => {
  //   setKey(i => i + 1)
  // }, [data])

  // console.log(key)

	return <Droppable
		direction='horizontal'
		droppableId={id}
		isDropDisabled={isDropDisabled}
		{...props}
	>
		{(provided, snapshot) => {
			return (
				<ClickContext.Provider value={{ onClick: onClick }}>
					<div
						className='items'
						ref={provided.innerRef}
						{...provided.droppableProps}
            // key={key}
						// style={{
						// 	cursor: snapshot.isDraggingOver ? 'copy' : ''
						// }}
					>
						{
							data.map((item, index) => {
								if (!item) return null;
								return (
									<Dragger
										id={`[${id}-${index}]${item.value}`}
										anitmation={anitmation}
										index={index}
										type={item.type}
										key={index}
										isDragOutId={isDragOutId}
									>
										{item.name}
									</Dragger>
								);
							})
						}
						{/* {
							anitmation ? provided.placeholder : (
								<div style={{ position: 'absolute' }}>
									{provided.placeholder}
								</div>
							)
						} */}
						{children}
					</div>
				</ClickContext.Provider>

			);
		}}
	</Droppable>;
};

export const DropBoard = ({ title, value, id, setValue, onDragList, isDragOutId, currentDragList, tip }) => {
	const onDrag = currentDragList === id;
	const isDropDisabled = !!(currentDragList && currentDragList !== id);

	return (
		<div className={"form-group formula"}>
			<label className='control-label col-xs-3'>
				{title}
				<InputTip msg={tip} />
			</label>
			<div className='col-xs-18'>
				<Dropper
					isDragOutId={isDragOutId}
					isDropDisabled={isDropDisabled}
					data={value}
					id={id}
					anitmation={value.length ? true : false}
					onDragList={onDragList}
				>
					{
						value.length ? (
							<div className="clear" onClick={()=> setValue([])}>clear all</div>
						) : (
							<div style={{ width: '100%', padding: '16px' }}>drag here</div>
						)
					}
				</Dropper>
				<div style={{
					position: 'absolute',
					bottom: 5,
					left: 'calc(50% - 16px)',
          ...!onDrag ? {
            display: 'none'
          } : {}
				}}>
					<Droppable
						droppableId={id + '-remover'}
					>
						{(provided, snapshot) => {
							return <div
								ref={provided.innerRef}
								{...provided.droppableProps}
								className="btn-delete"
								// style={{ bottom: 10, display:  onDrag ? '' : 'none', }}
                key={onDrag}
							>
								<div>del</div>
								{provided.placeholder}
							</div>;
						}}
					</Droppable>
				</div>
			</div>
		</div>
	);
};