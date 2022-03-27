import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { IToDoState, toDoState } from '../atoms';
import { saveTaskInLocalStorage } from '../storage.util';

const Task = styled.div<{isDragging : boolean}>`
    padding : 10px;
    width : 100%;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    border-radius : 5px;
    margin-bottom: 10px;
    color : ${props => props.theme.textColor};
    background-color: ${props => 
        props.isDragging ? props.theme.titleColor : props.theme.cardColor};
    box-shadow: ${props => props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "none"};
`

const DeleteBtn = styled.button`
    border : none;
    background-color: transparent;
    color : #E0E0DF;
    transition: color 0.2s ease-in-out;
    &:hover {
        cursor: pointer;
        /* color : #5b5b5b; */
        color : red;
        font-weight: bold;
    }
`

interface IDraggableCardsProps {
    todoId : number;
    toDoText : string;
    index : number;
    boardId : string;
}

function DraggableCard({todoId, toDoText, index, boardId}:IDraggableCardsProps) {
    const setTaskArr:SetterOrUpdater<IToDoState> = useSetRecoilState(toDoState);
    
    const deleteTask = (todoId : number) => {
        setTaskArr((tasks : IToDoState) =>  {
            const copyTaskList = [...tasks[boardId]];
            const taskListAfterDelete = copyTaskList.filter(task => task.id !== todoId);
            const result = {
                ...tasks,
                [boardId] : taskListAfterDelete
            };
            saveTaskInLocalStorage(result);
            return result;
        })
    }
    return (
        <>
            <Draggable draggableId={todoId + ""} index={index}>
                {(magic, snapshot) => 
                (<Task
                    isDragging = {snapshot.isDragging}
                    ref={magic.innerRef} {...magic.draggableProps} {...magic.dragHandleProps}>
                    {toDoText}
                    <DeleteBtn onClick={() => deleteTask(todoId)} type="button">X</DeleteBtn>
                </Task>)
                }
            </Draggable>
        </>

    )
}

// React.memo => If the props didn't change DON'T RERENDER this DraggableCard.
export default React.memo(DraggableCard);