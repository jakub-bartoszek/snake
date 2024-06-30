import { useState } from "react";
import useGameLogic from "../hooks/useGameLogic";
import DropDownList from "./drop-down-list";
import GamePaused from "./game-paused";
import GameOver from "./game-over";
import Board from "./board";

const difficultyOptions = [
 { label: "EASY", value: 500 },
 { label: "NORMAL", value: 350 },
 { label: "HARD", value: 150 }
];

const boardSizes = [
 { label: "SMALL", value: 8 },
 { label: "MEDIUM", value: 11 },
 { label: "LARGE", value: 19 }
];

const Game = () => {
 const [boardSize, setBoardSize] = useState({
  label: "MEDIUM",
  value: 11
 });
 const [snakeSpeed, setSnakeSpeed] = useState({
  label: "NORMAL",
  value: 350
 });

 const { snake, fruit, gameOver, pause, points, directionRef } =
  useGameLogic({
   boardSizeValue: boardSize.value,
   snakeSpeedValue: snakeSpeed.value
  });

 const changeBoardSize = (label: string, value: number) =>
  setBoardSize({ label, value });
 const changeDifficulty = (label: string, value: number) =>
  setSnakeSpeed({ label, value });

 return (
  <div className="flex flex-col items-center shadow-[0_0_200px_#00000080] rounded-xl">
   <div className="flex justify-between items-center w-full py-2 px-4 relative">
    <DropDownList
     gameResumed={!!(directionRef.current || pause || gameOver)}
     currentOption={snakeSpeed.label}
     options={difficultyOptions}
     changeOption={changeDifficulty}
    />
    <div className="text-white text-3xl font-bold">{points}</div>
    <DropDownList
     gameResumed={!!(directionRef.current || pause || gameOver)}
     currentOption={boardSize.label}
     options={boardSizes}
     changeOption={changeBoardSize}
    />
   </div>
   <div className="relative bg-gradient-to-tl from-cyan-400 via-indigo-600 to-rose-900 rounded-md overflow-hidden">
    {gameOver && <GameOver />}
    {pause && !gameOver && <GamePaused />}
    <Board
     boardSize={boardSize.value}
     snake={snake}
     fruit={fruit}
    />
   </div>
  </div>
 );
};

export default Game;
