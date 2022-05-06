import React from 'react'
import styled from 'styled-components';
import { useForm } from 'react-hook-form'
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { IToDoState, toDoState } from '../atoms';
import { saveTaskInLocalStorage } from '../storage.util';



const CreateForm = styled.form`
    visibility: hidden;
    width : 0;
    input {
        border : none;
        background-color: transparent;
        width : 100%;
        padding : 10px;
        letter-spacing: 1.5px;
        font-size : 1em;
        font-weight: 700;
        opacity: 0.8;
        color : ${props => props.theme.bgColor};
        &:focus {
            outline: none;
        }
    }
`

const CreateFromWrapper = styled.div`
    width : 3.5em;
    height : 3.5em;
    border-radius: 50px;
    background-color : ${props => props.theme.titleColor};
    display : inline-flex;
    align-items: center;
    justify-content: center;
    padding : 20px;
    overflow-y: hidden;
    transition : width 0.3s linear;
    p {
        position: relative;
        font-size: 30px;
        transition : color 0.2s ease-in;
    }
    &:hover {
        cursor: pointer;
        width : 16em;
        ${CreateForm} {
            width : 90%;
            visibility: visible;
        }
        p {
            color : ${props => props.theme.bgColor};
            opacity: 0.6;
        }
    }
`

interface IBoardForm {
    boardId : string;
}


function CreatingBoard() {

    const setBoard:SetterOrUpdater<IToDoState> = useSetRecoilState(toDoState);

    const { register, getValues, setValue, handleSubmit } = useForm<IBoardForm>();
    const onValid = () => {
        setBoard((todo : IToDoState) => {
            const {boardId} = getValues();
            const result:IToDoState = {[boardId] : [], ...todo};
            saveTaskInLocalStorage(result);
            return result;
        });
        setValue("boardId", "");
    }

    return (
        <CreateFromWrapper>
            <p>+</p>
            <CreateForm onSubmit={handleSubmit(onValid)}>
                <input
                    {...register("boardId", {required : "add a new board"})}
                    type = "text"
                    placeholder='Make a New Board!'/>
            </CreateForm>
        </CreateFromWrapper>
    )
}

export default CreatingBoard