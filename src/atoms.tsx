import { atom, selector } from "recoil";



export interface IToDo {
    id : number;
    text : string;
}

export interface IToDoState {
    [key : string] : IToDo[];
}

// localstorage 에 저장된 데이터 불러오기
const localStorageTask:string = localStorage.getItem("TASK") || "{}";

const parseLocalStroageTask = JSON.parse(localStorageTask);

export const boardState = atom<IToDoState>({
    key : "board",
    default : {
        to_do : []
    }
})

export const toDoState = atom<IToDoState>({
    key : "toDo",
    default : parseLocalStroageTask
})