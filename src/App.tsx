import React from 'react';
import { DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import Board from './Components/Board';
import CreatingBoard from './Components/CreatingBoard';
import { saveTaskInLocalStorage } from './storage.util';


const Wrapper = styled.div`
  padding : 20px;
  display : flex;
  flex-direction: column;
  max-width: 100vw;
  margin : 0 auto;
  justify-content: center;
  align-items: center;
  height : fit-content;
`

const Header = styled.div`
  /* border: 1px solid white; */
  min-height : 5em;
  width : 100%;
  position: sticky;
  padding : 10px 0px 20px 0px;
  top: 0;
  left : 0;
  z-index : 1;
  /* background-color : ${props => props.theme.bgColor}; */
`

const Content = styled.div`
  width : 100%;
  height : fit-content;
`

const Boards = styled.div`
  /* border: 1px solid white; */
  display : grid;
  width : 100%;
  gap : 10px;
  grid-template-columns: repeat(3, 1fr);
`



function App() {

  const [toDos, setToDos] = useRecoilState(toDoState);

  console.log(toDos);

  // drag 가 끝났을때 실행되는 함수 설정 -> 옮긴 곳으로 고정시킴
  const onDragEnd = (info:DropResult) => {
    const {destination, draggableId, source} = info;
    if(!destination) return;

    // 보드 순서 변경
    if(source.droppableId === "Boards"){
      setToDos((allBoards) => {
        const boardListCopy = Object.keys(allBoards);
        const targetBoard = boardListCopy[source.index];
        boardListCopy.splice(source.index, 1);
        boardListCopy.splice(destination?.index, 0, targetBoard);
        let newBoards = {};
        boardListCopy.map((board) => {
          newBoards = { ...newBoards, [board]: allBoards[board]}
        });
        const result =  {...newBoards};
        saveTaskInLocalStorage(result);
        return result;
      })
    }

    // 같은 보드상에서 움직이는 경우
    if(destination?.droppableId === source.droppableId){
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        // 1)source.index 옮기려는거 기존 배열에서 삭제하기
        boardCopy.splice(source.index, 1);
        // 2)destination.index 자리에 새롭게 추가해주기
        boardCopy.splice(destination?.index, 0, taskObj);
        const result = {
          ...allBoards,
          [source.droppableId] : boardCopy,
        };
        saveTaskInLocalStorage(result);
        return result;
      });
    }

    // 여러보드를 옮기는 경우
    if(destination.droppableId !== source.droppableId){
      setToDos((allBoards) => {
        const sourceCopy = [...allBoards[source.droppableId]];
        const taskObj = sourceCopy[source.index];
        const destinationCopy = [...allBoards[destination.droppableId]];
        sourceCopy.splice(source.index, 1);
        destinationCopy.splice(destination.index, 0, taskObj);
        const result = {
          ...allBoards,
          [source.droppableId] : sourceCopy,
          [destination.droppableId] : destinationCopy
        }
        saveTaskInLocalStorage(result);
        return result;
      })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Header>
          <CreatingBoard/>
        </Header>
        <Content>
          <Droppable droppableId='Boards' direction='horizontal' type='BOARD'>
            {(provided) => (
              <Boards ref={provided.innerRef} {...provided.droppableProps}>
                {Object.keys(toDos).map((boardId:string, index:number) => (
                  <Board toDos={toDos[boardId]} boardId={boardId} key={boardId} index={index}/>
                ))}
                {provided.placeholder}
              </Boards>
            )}
          </Droppable>
        </Content>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
