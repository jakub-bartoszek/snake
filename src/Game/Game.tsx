import { useEffect, useState } from "react";

const BOARD_SIZE = 10;
const INITIAL_SNAKE = [
 { x: 5, y: 5 },
 { x: 6, y: 5 },
 { x: 7, y: 5 }
];

const Game = () => {
 const [snakeCells, setSnakeCells] = useState(INITIAL_SNAKE);
 const [direction, setDirection] = useState<String | null>(null);
 const [gameOver, setGameOver] = useState(false);

 const handleKeyDown = (event: any) => {
  if (!gameOver) {
   switch (event.key) {
    case "ArrowUp":
     if (direction !== "down") setDirection("up");
     break;
    case "ArrowDown":
     if (direction !== "up") setDirection("down");
     break;
    case "ArrowLeft":
     if (direction !== "right") setDirection("left");
     break;
    case "ArrowRight":
     if (direction !== "left") setDirection("right");
     break;
    default:
     break;
   }
  }
 };

 const moveSnake = () => {
  if (!direction && gameOver) return;

  setSnakeCells((prevSnake) => {
   const newSnake = [...prevSnake];
   const head = { ...newSnake[0] };

   switch (direction) {
    case "up":
     head.y = head.y - 1;
     break;
    case "down":
     head.y = head.y + 1;
     break;
    case "left":
     head.x = head.x - 1;
     break;
    case "right":
     head.x = head.x + 1;
     break;
    default:
     break;
   }

   if (
    head.y < 0 ||
    head.y >= BOARD_SIZE ||
    head.x < 0 ||
    head.x >= BOARD_SIZE
   ) {
    setGameOver(true);
    return prevSnake;
   }

   newSnake.unshift(head);
   newSnake.pop();
   return newSnake;
  });
 };

 useEffect(() => {
  window.addEventListener("keydown", handleKeyDown);

  return () => {
   window.removeEventListener("keydown", handleKeyDown);
  };
 }, [direction]);

 useEffect(() => {
  if (direction && !gameOver) {
   const interval = setInterval(moveSnake, 500);
   return () => clearInterval(interval);
  }
 }, [direction]);

 const restartGame = () => {
  setSnakeCells(INITIAL_SNAKE);
  setDirection(null);
  setGameOver(false);
 };

 return (
  <div className="bg-black/30 border-[1px] border-black relative">
   {gameOver && (
    <div className="absolute w-full h-full bg-black/50 flex items-center justify-center">
     <button
      onClick={restartGame}
      className="border-2 border-white py-2 px-4 rounded-full text-white font-bold text-xl"
     >
      Try again
     </button>
    </div>
   )}
   {Array.from({ length: BOARD_SIZE }).map((_, row) => (
    <div
     key={row}
     className="flex justify-center"
    >
     {Array.from({ length: BOARD_SIZE }).map((_, col) => {
      const isSnakeCell = snakeCells.some(
       (cell) => cell.x === col && cell.y === row
      );
      return (
       <div
        key={col}
        className={`h-6 w-6 border-[1px] border-black ${
         isSnakeCell ? "bg-green-500" : ""
        }`}
       ></div>
      );
     })}
    </div>
   ))}
  </div>
 );
};

export default Game;
