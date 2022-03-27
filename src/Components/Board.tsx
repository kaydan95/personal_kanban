import { useForm } from 'react-hook-form'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import DraggableCard from './DraggableCard';
import { IToDo, IToDoState, toDoState } from '../atoms';
import { saveTaskInLocalStorage } from '../storage.util';

const BoardWrapper = styled.div<{ isDragging: boolean }>`
    padding : 15px;
    position: relative;
    border-radius : 10px;
    max-width : 480px; 
    min-height: 350px;
    margin : 5px;
    background-color : ${props => props.theme.accentColor};
`

const BoardHeader = styled.div<{ isDragging: boolean }>`
    min-height : 80px;
    width : 100%;
    display : flex;
    flex-direction : column;
    justify-content: center;
    align-items: center;
`

const BoardTitle = styled.div`
    display : inline-flex;
    justify-content: center;
    width: 100%;
    span {
        color : ${props => props.theme.titleColor};
        font-size: 1.5em;
        margin : 5px 0px 15px 0px;
    }
    /* justify-content: space-evenly; */
`

const DeleteBtn = styled.button`
    border : none;
    font-size : 1.3em;
    background-color: transparent;
    color : #404b5d;
    height: fit-content;
    position: absolute;
    right: 10px;
    &:hover {
        cursor: pointer;
        color : ${props => props.theme.titleColor};
        /* color : #E0E0DF; */
    }
`

const BoardContent = styled.div<IBoardAreaProps>`
    padding-top : 10px;
    min-height: 200px;
    transition : background-color 0.3s ease-in-out;
    /* background-color: ${props => props.isDraggingOver ? props.theme.upColor : props.isDraggingFromThis ? props.theme.downColor : props.theme.accentColor}; */
`


const Form = styled.form`
    width : 100%;
    margin-bottom: 10px;
    input {
        padding : 5px 0px 5px 8px;
        width : 100%;
        border : none;
        border-bottom: 1px solid whitesmoke;
        background-color: transparent;
        color : white;
        font-size: 1em;
        letter-spacing: 1px;
        &:focus {
            outline: none;
        }
        &:placeholder-shown {
            color : white;
        }
    }

`

interface IBoardProps {
    toDos : IToDo[],
    boardId : string;
    index : number;
}

interface IBoardAreaProps {
    isDraggingFromThis : boolean;
    isDraggingOver : boolean;
}

interface IFrom {
    text : string;
}

function Board({toDos, boardId, index} : IBoardProps) {
    const setToDos:SetterOrUpdater<IToDoState> = useSetRecoilState(toDoState);
    const { register, getValues, setValue, handleSubmit } = useForm<IFrom>();
    const onValid = ():void => {
        setToDos((toDos : IToDoState) => {
            const { text } = getValues();
            const newToDo = {
                id : Date.now(),
                text
            }
            const result = {...toDos,
                [boardId] : [
                    // 기존에 있던 해당 board 의 내용들 
                    ...toDos[boardId],
                    // 해당 board 에 새로 들어갈 obj
                    newToDo
                ]};
            saveTaskInLocalStorage(result);
            return result;
        })
        setValue("text" , "");
    }

    const deleteBoard = (boardId : string) => {
        setToDos((toDos : IToDoState) => {
            const copyBoard = {...toDos};
            delete copyBoard[boardId];
            const result = copyBoard;
            saveTaskInLocalStorage(result);
            return result;
        })
    }

    return (
        <Draggable draggableId={boardId} index={index}>
            {(magic, snapshot) => (
                <BoardWrapper key={index} ref={magic.innerRef} isDragging={snapshot.isDragging} {...magic.draggableProps}>
                    <BoardHeader isDragging={snapshot.isDragging} {...magic.dragHandleProps}>
                        <BoardTitle>
                            <span>{boardId}</span>
                            <DeleteBtn type="button" onClick={()=> deleteBoard(boardId)}>X</DeleteBtn>
                        </BoardTitle>
                        <Form onSubmit={handleSubmit(onValid)}>
                            <input
                                {...register("text", {required : true})}
                                type="text" placeholder={`Add some tasks in area, ${boardId}`}>
                            </input>
                        </Form>
                    </BoardHeader>
                    <Droppable droppableId={boardId}>
                        {(magic, snapshot) => 
                            (<BoardContent 
                                isDraggingOver={snapshot.isDraggingOver}
                                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                                ref={magic.innerRef} 
                                {...magic.droppableProps}
                            >
                                {toDos?.map((todo, index) => (
                                <DraggableCard key = {todo.id} index={index} todoId={todo.id} boardId={boardId} toDoText={todo.text}/>
                                ))}
                                {magic.placeholder}
                            </BoardContent>)
                        }
                    </Droppable>
                </BoardWrapper>
            )}
        </Draggable>

    )
}

export default Board
