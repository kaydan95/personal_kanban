# :spiral_notepad: Personal_kanban [![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

<img src="https://user-images.githubusercontent.com/85853145/163391390-4ca90c9b-832d-4e30-94a5-76d3f58ece1e.gif" width="1000" height="500">

## Summary / 요약

- **목적** : NomadCoders React강의 일부 및 다양한 라이브러리 연습
- **라이브러리 종류** : Recoil / beautiful-dnd / react-hook-form
- **메인 개발 환경** : React / Typescript / JavaScript


## For Start / 시작하기 전에
    npm install recoil
    npm install --save styled-components
    npm i -D @types/styled-components
    npm install react-hook-form


## Features / 특징..?

### 커스텀! :upside_down_face:

본 강의에서는 기본적으로 보드안에 todo 를 만드는 것 까지만 진행한다. 챌린지를 신청하지 않았지만 챌린지 내용의 일부를 구현해봤다. 색상 조합도 무난하게 (내취향으로)

#### 1. Board Create 버튼
- 좌측 상단에 ➕ 에 마우스를 올려놓으면 생성할 Board 의 이름을 적어놓을 수 있도록 했다. 따로 Form Modal을 띄우지 않고 가장 깔끔하고 간편하게 할 수 있는 방법이라고 생각했기 때문.  
✔️framer-motion 으로 더 간편하게 animation을 구현할 수 있을 것 같다.

#### 2. Local Storage 에 저장
- 챌린지 내용 중에 Board와 해당 todo의 내용들을 Local Storage에 저장하기 라는 항목이 있었다. 그렇게 하려면 LocalStorage 에 저장한 후 해당 Board 에 todo를 추가해야하기 때문에 LocalStorage 내용을 default 로 한 채 호출과 수정을 해야했다. 이 부분에서 조금 끙끙대다 같은 강의를 듣고 챌린지를 하신 분의 페이지를 통해 도움을 받아 해결할 수 있었다.(:pleading_face:).   
- Board 를 생성하고 todo를 작성 할 때마다 해당 내용들이 저장되어야하기 때문에 바로 Local Storage로 저장하는 함수를 `storage.util.ts` 라는 파일을 생성 후 다음과 같이 함수를 정의했다.

```typescript
export const saveTaskInLocalStorage = (result : IToDoState) => {
    return localStorage.setItem("TASK", JSON.stringify(result))
};
```
  그리고 호출 및 수정을 위해서 다음과 같이 정의한 뒤 
  
 ```typescript
const localStorageTask:string = localStorage.getItem("TASK") || "{}";
const parseLocalStroageTask = JSON.parse(localStorageTask);

export const toDoState = atom<IToDoState>({
    key : "toDo",
    default : parseLocalStroageTask
})
```
  실제 Board를 만드는 건 react-hook-form 를 함께 이용해 다음과 같이 구현했다.
  
 ```typescript
interface IBoardForm {
    boardId : string;
};


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
    };

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
```
 
#### 3. 휴지통의 부재..(꾀가 늘었다.)
- Draggable 기능을 이용해서 휴지통으로 드래그 해 항목을 삭제하는 기능도 챌린지 내용 중에 있었지만...아무리 생각해도 todo와 Board를 휴지통까지 드래그해 삭제를 한다는 건 불편할 것 같아서 구현하지 않았다. Board 우측 상단과 각 todo 오른쪽 끝에 ✖️ 아이콘을 넣고 이를 클릭하면 바로 삭제 할 수 있도록 구현했다. (실제 사용자도 아니지만 100% 만족 중)
- 물론 해당 LocalStorage에서 내용을 update 하는 과정 또한 잊지 않았다   
☑️ 다음에는 해당 todo를 클릭하면 수정하는 기능을 추가해도 괜찮을 것 같다.

```typescript
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
```
- 기존에 있던 todo 배열을 복사해 그 중 삭제하려는 todo.id와 일치하지 않는 것만 필터링한다   
  -> 그럼 필터링 된 새 배열은 삭제하려는 항목을 제외한 나머지 항목들로만 구성된다. 즉, 보기에는 삭제가 된 것처럼 보이는 것.    
  -> 이렇게 생성된 새로운 배열을 `saveTaskInLocalStorage(result);` 을 통해 LocalStorage 에 저장해주면 Update 완료.   
  
🤓 이전 프로젝트에서 실제 MongoDB를 사용하다 보니 delete 는 어떻게 해야하지 잠깐 생각했었다.  이런 기막힌 방법이라니..!


## Github Page 로 배포 :relieved:

Momentum clone 으로 배포하고 나서 이제 꾸준히 하는 중! 별 무리 없이 배포가 완료되었다.
