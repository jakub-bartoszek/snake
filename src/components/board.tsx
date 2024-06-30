import { twMerge } from "tailwind-merge";
import { Fruit, Snake } from "../hooks/useGameLogic";

interface BoardProps {
 boardSize: number;
 snake: Snake[];
 fruit: Fruit;
}

const Board = ({ boardSize, snake, fruit }: BoardProps) => (
 <>
  {Array.from({ length: boardSize }).map((_, row) => (
   <div
    key={row}
    className="flex justify-center"
   >
    {Array.from({ length: boardSize }).map((_, col) => {
     const isSnakeHead = snake[0].x === col && snake[0].y === row;
     const isSnakeCell = snake.some(
      (cell) => cell.x === col && cell.y === row
     );
     const isFruitCell = fruit.x === col && fruit.y === row;
     const evenBlock = (row + col) % 2 === 0;
     return (
      <div
       className={twMerge("h-8 w-8", evenBlock && "bg-black/20")}
       key={col}
      >
       <div
        className={twMerge(
         "h-full w-full rounded-md transition-all",
         isSnakeCell &&
          "bg-gradient-radial from-green-500 to-green-600 shadow-[0_0_10px_#00000050]",
         isSnakeHead &&
          "bg-gradient-radial from-green-300 to-green-400 shadow-[0_0_10px_#00000050]",
         isFruitCell &&
          "bg-gradient-radial from-red-400 to-red-700 rounded-xl shadow-[0_0_30px_5px_red]"
        )}
       ></div>
      </div>
     );
    })}
   </div>
  ))}
 </>
);

export default Board;
