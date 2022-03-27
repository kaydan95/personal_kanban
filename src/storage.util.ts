import { IToDoState } from "./atoms";

// localstorage에 데이터 저장
export const saveTaskInLocalStorage = (result : IToDoState) => {
    return localStorage.setItem("TASK", JSON.stringify(result))
};