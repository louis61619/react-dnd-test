import React, { useContext, useEffect, useRef, createContext, useState, useCallback, cloneElement, Children } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function _index(el) {
  let index = 0;
  if (!el || !el.parentNode) {
    return -1;
  }
  while (el && (el = el.previousElementSibling)) {
    index++;
  }
  return index;
}

export const Context = createContext({
  onDragEnd: () => {},
  onDragStart: () => {},
  getDragElement: () => {},
  setDragElement: () => {},
  getOriginElement: () => {},
  setOriginElement: () => {},
  setDragInfo: () => {},
  getDragInfo: () => {},
  cleanFake: () => {},
  currentDroppable: null,
  setCurrentDroppable: () => {}
})

export const DroppableContext = createContext({
  droppableId: null,
  isDropDisabled: false,
  childrenMap: {},
  setChildrenMap: () => {}
})

// const dragInfo = {
//   source: {
//     droppableId: dragDroppableId,
//     draggableId,
//     index
//   }, 
//   destination: {
//     // draggableId,
//     droppableId,
//     index: dragIndex + 1
//   }, 
//   draggableId
// }
export const Draggable = ({ children, draggableId, index }) => {
  const ref = useRef()
  const { setDragElement, onDragEnd, getDragElement, setOriginElement, setDragInfo, onDragStart } = useContext(Context)
  const { droppableId, isDropDisabled, setChildrenMap } = useContext(DroppableContext)

  const [{ handlerId, dragging }, drop]= useDrop({
    accept: 'box',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current || isDropDisabled) {
        return
      }
      
      const sourcDroppableId = item.droppableId;
      const destinationDroppableId = droppableId

      
      const hovering = ref.current
      let dragging = item.ref.current;

			// const dragingRect = dragging.getBoundingClientRect();
      // const targetRect = hovering.getBoundingClientRect();
      const dragIndex = _index(dragging)
      const hoverIndex = _index(hovering)

      // 複製
      if (destinationDroppableId !== sourcDroppableId) {
        // const dragging = item.ref.current
        if (getDragElement()) {
          const dragging = getDragElement()
          const parentNode = hovering.parentNode
          dragging.style.opacity = 0;
          setDragElement(dragging)
          if (!parentNode) {
            return
          }
          parentNode.removeChild(dragging)
          if (dragIndex < hoverIndex) {
            parentNode.insertBefore(dragging, hovering.nextSibling);
          } else {
            parentNode.insertBefore(dragging, hovering);
          }
        } else {
          const dragging = item.ref.current.cloneNode(true);
          dragging.style.opacity = 0;
          const parentNode = hovering.parentNode;
          setDragElement(dragging)
          parentNode.insertBefore(dragging, hovering.nextSibling);
        }

        const nodes = Array.from(hovering.parentNode.childNodes)?.filter(item => {
          // return !item.getAttribute("style"
          return item.getAttribute("style") !== 'display: none;'
        })
        const findIndex = nodes.findIndex(item => {
          return item.getAttribute("style") === 'opacity: 0;'
        })

        const dragInfo = {
          source: {
            droppableId: item.droppableId,
            draggableId: item.draggableId,
            index: item.index
          }, 
          destination: {
            droppableId: destinationDroppableId,
            index: findIndex
          }, 
          draggableId: item.draggableId
        }
        setDragInfo(dragInfo)
        return
      }

      if (dragIndex === hoverIndex || dragging === hovering) {
        return
      }

      // 交換
      if (destinationDroppableId === sourcDroppableId) {
        const dragging = getDragElement() || item.ref.current.cloneNode(true);
        const orignEl = item.ref.current;
        const dragIndex = _index(dragging)
        const parentNode = hovering.parentNode;
        dragging.style.opacity = 0;
        setDragElement(dragging);
        setOriginElement(orignEl);
        if (!parentNode) {
          return
        }
        if (parentNode.contains(dragging)) {
          parentNode.removeChild(dragging)
        }
        
        if (dragIndex < hoverIndex) {
          parentNode.insertBefore(dragging, hovering.nextSibling);
        } else {
          parentNode.insertBefore(dragging, hovering);
        }
        
        const nodes = Array.from(parentNode.childNodes)?.filter(item => {
          // return !item.getAttribute("style"
          return item.getAttribute("style") !== 'display: none;'
        })
        const findIndex = nodes.findIndex(item => {
          return item.getAttribute("style") === 'opacity: 0;'
        })

        const dragInfo = {
          source: {
            droppableId: sourcDroppableId,
            draggableId,
            index: item.index
          }, 
          destination: {
            droppableId: destinationDroppableId,
            index: findIndex
          }, 
          draggableId: item.draggableId
        }
        
        setDragInfo(dragInfo)
      }
    },
    drop: (item) => {
      onDragEnd()
    },
  });

  const [{ isDragging }, drag]= useDrag({
    type: 'box',
    item: {
      draggableId,
      droppableId,
      index,
      ref
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        const dragInfo = {
          source: {
            droppableId: item.droppableId,
            draggableId: item.draggableId,
            index
          }, 
          destination: null, 
          draggableId
        }
        setDragInfo(dragInfo)
        onDragEnd()
      }
    },
    options: {
      dropEffect: 'copy'
    }
  });

  useEffect(() => {
    if (isDragging) {
      onDragStart({ draggableId })
    }
    
  }, [isDragging, onDragStart, draggableId])

  if (isDropDisabled) {
    drag(ref)
  } else {
    drag(drop(ref))
  }

  return children({
    innerRef: el => {
      ref.current = el;
      setChildrenMap(index, el)
    },
    draggableProps: {
    },
    dragHandleProps: {
      'data-handler-id': handlerId,
      'data-handler-index': index
    }
  }, {
    isDragging
  })
}

export const Droppable = ({ children, droppableId, isDropDisabled }) => {
  const ref = useRef()
  const { onDragEnd, getDragElement, setDragElement, setDragInfo, getDragInfo, cleanFake, setCurrentDroppable, currentDroppable } = useContext(Context);
  const childrenMap = useRef({})
  const overRecord = useRef(false)

  const setChildrenMap = useCallback((idx, el) => {
    childrenMap.current[idx] = el
  }, [])

  const [{ dropId, isOver, canDrop }, drop]= useDrop({
    accept: 'box',
    collect(monitor) {
      return {
        dropId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }
    },
    hover(item, monitor) {
      if (!ref.current || isDropDisabled) {
        return
      }

      if (item.droppableId) {
        setCurrentDroppable(item.droppableId)
      }
      
      // 複製
      const dragInfo = getDragInfo()
      if (dragInfo?.destination?.droppableId !== droppableId) {
        cleanFake();
      }

      if (!getDragElement() || (dragInfo?.destination?.droppableId !== droppableId)) {
        const dragging = item.ref.current.cloneNode(true);
        dragging.style.opacity = 0;
        const parentNode = ref.current;
        setDragElement(dragging);
        parentNode.appendChild(dragging);
        const dragInfo = {
          source: {
            droppableId: item.droppableId,
            draggableId: item.draggableId,
            index: _index(item.ref.current)
          }, 
          destination: {
            droppableId: droppableId,
            index: Object.keys(childrenMap.current).length
          }, 
          draggableId: item.draggableId
        }
        setDragInfo(dragInfo)
      } else {

        // 移動位置
        // 如果想的話只能透過計算位置了
      }

      

      // const sourcDroppableId = item.droppableId;
      // const destinationDroppableId = droppableId
      // if (sourcDroppableId === destinationDroppableId) {
      //   return
      // }
      // const hovering = ref.current
      // if (!dragElement.current) {
      //   const dragging = monitor.getItem().ref.current
      //   hovering.appendChild(dragging);
      //   // setDragElement(dragging)
      // }
    },
    drop({ draggableId, droppableId: dragDroppableId, index, ref }) {
      if (isDropDisabled) return;

      onDragEnd()
      // const dragIndex = Object.keys(childrenMap.current).length + 1;
      
      // const result = {
      //   source: {
      //     droppableId: dragDroppableId,
      //     draggableId,
      //     index
      //   }, 
      //   destination: {
      //     // draggableId,
      //     droppableId,
      //     index: dragIndex + 1
      //   }, 
      //   draggableId
      // }
      // onDragEnd(result)
    },
  });

  const dropRef = drop(ref);
  const isCur = !currentDroppable || (currentDroppable === droppableId)


  return <DroppableContext.Provider value={{ droppableId, isDropDisabled, dropRef, setChildrenMap, childrenMap }}>
    {
      children({
        innerRef: isDropDisabled ? null : ref,
        droppableProps: {
          'data-drop-id': dropId,
        }
      }, {})
    }
  </DroppableContext.Provider>
}

export const DragDropContext = ({ children, onDragEnd, onDragStart, ...props }) => {
  const dragElement = useRef();
  const [currentDroppable, setCurrentDroppable] = useState();
  const isDragStart = useRef(false)

  const setDragElement = useCallback((el) => {
    dragElement.current = el
  }, []);
  const getDragElement = useCallback(() => dragElement.current, []);

  // 判斷是否有原始的元素，拖曳時會隱藏，onDragEnd後要顯示
  const originElement = useRef();
  const setOriginElement = useCallback((el) => {
    el.style.display = 'none'
    originElement.current = el
  }, [])
  const getOriginElement = useCallback(() => originElement.current, [])

  
  const dragInfo = useRef()
  const setDragInfo =  useCallback((info) => {
    dragInfo.current = info
  }, [])
  const getDragInfo = useCallback(() => dragInfo.current, [])
  

  const _onDragStart = useCallback(({ draggableId }) => {
    
    if (!isDragStart.current) {
      onDragStart({ draggableId })
      isDragStart.current = true
    }
  }, [onDragStart])

  const cleanFake = useCallback(() => {
    if (dragElement.current) {
      dragElement.current.parentNode?.removeChild(dragElement.current)
    }
    if (originElement.current) {
      originElement.current.style.display = null
    }
  }, [])

  const _onDragEnd = useCallback(() => {
    if (dragElement.current) {
      // isDragStart.current = false
      // 刪除拖曳元素，回復隱藏的原始元素
      cleanFake()
      
      setDragElement(null)
      if (!dragInfo.current) return;
      const timer = setTimeout(() => {
        isDragStart.current = false
      }, 500)
      if (!isDragStart.current) {
        clearTimeout(timer)
      }
      onDragEnd(dragInfo.current)
    }
    
  }, [onDragEnd, setDragElement, cleanFake])

  return <DndProvider backend={HTML5Backend} options={{ enableMouseEvents: true }}>
    <Context.Provider value={{ 
      cleanFake, 
      setDragElement, 
      getDragElement, 
      setOriginElement, 
      getDragInfo, 
      getOriginElement, 
      setDragInfo, 
      onDragEnd: _onDragEnd,
      onDragStart: _onDragStart,
      setCurrentDroppable,
      currentDroppable,
      ...props
    }}>
      {children}
    </Context.Provider>
  </DndProvider>
}