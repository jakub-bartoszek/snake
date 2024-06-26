import { useEffect, useState, useCallback, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { MdOutlineSpaceBar } from "react-icons/md";
import {
 FaLongArrowAltDown,
 FaLongArrowAltLeft,
 FaLongArrowAltRight,
 FaLongArrowAltUp
} from "react-icons/fa";

interface Fruit {
 x: number;
 y: number;
}

interface Snake {
 x: number;
 y: number;
}

const BOARD_SIZE = 11;
const INITIAL_SNAKE: Snake[] = [{ x: 5, y: 5 }];

const Game = () => {
 const [snake, setSnake] = useState<Snake[]>(INITIAL_SNAKE);
 const [fruit, setFruit] = useState<Fruit>({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE)
 });
 const [gameOver, setGameOver] = useState(false);
 const [pending, setPending] = useState(false);
 const [points, setPoints] = useState(0);
 const [pause, setPause] = useState(false);
 const directionRef = useRef<string | null>(null);
 const intervalRef = useRef<NodeJS.Timeout | null>(null);

 // Changing direction
 const handleKeyDown = useCallback(
  (event: KeyboardEvent) => {
   if (event.key === "p" || event.key === "P") {
    setPause((prevPause) => !prevPause);
    return;
   }

   if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
     event.key
    )
   ) {
    if (pause) {
     setPause(false);
    }

    if (!gameOver && !pending) {
     setPending(true);
     switch (event.key) {
      case "ArrowUp":
       if (directionRef.current !== "down") {
        directionRef.current = "up";
       }
       break;
      case "ArrowDown":
       if (directionRef.current !== "up") {
        directionRef.current = "down";
       }
       break;
      case "ArrowLeft":
       if (directionRef.current !== "right") {
        directionRef.current = "left";
       }
       break;
      case "ArrowRight":
       if (directionRef.current !== "left") {
        directionRef.current = "right";
       }
       break;
      default:
       break;
     }
    }
   }

   // Handle spacebar for restarting the game
   if (event.key === " ") {
    if (gameOver) {
     restartGame();
    }
   }
  },
  [gameOver, pause, pending]
 );

 // Listening for keydown events
 useEffect(() => {
  window.addEventListener("keydown", handleKeyDown);

  return () => {
   window.removeEventListener("keydown", handleKeyDown);
  };
 }, [handleKeyDown]);

 // Interval for moving snake
 useEffect(() => {
  if (!gameOver && !pause) {
   intervalRef.current = setInterval(moveSnake, 300);

   return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
   };
  } else if (pause) {
   if (intervalRef.current) clearInterval(intervalRef.current);
  }
 }, [gameOver, pause]);

 // Moving snake logic
 const moveSnake = () => {
  setSnake((prevSnake) => {
   const newSnake = [...prevSnake];
   const head = { ...newSnake[0] };
   const currentDirection = directionRef.current;

   switch (currentDirection) {
    case "up":
     head.y -= 1;
     break;
    case "down":
     head.y += 1;
     break;
    case "left":
     head.x -= 1;
     break;
    case "right":
     head.x += 1;
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

   if (
    newSnake
     .slice(1)
     .some((cell) => cell.x === head.x && cell.y === head.y)
   ) {
    setGameOver(true);
    return prevSnake;
   }

   setPending(false);
   return newSnake;
  });
 };

 // Snake eating fruit logic
 useEffect(() => {
  const head = snake[0];
  if (head.y === fruit.y && head.x === fruit.x) {
   setSnake((prevSnake) => [...prevSnake, fruit]);
   setFruit(generateFruit());
   setPoints((points) => points + 1);
  }
 }, [snake, fruit]);

 // Generating new fruit
 const generateFruit = (): Fruit => {
  let newFruit: Fruit;
  const isOccupied = (fruit: Fruit) =>
   snake.some((cell) => cell.x === fruit.x && cell.y === fruit.y);

  do {
   newFruit = {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE)
   };
  } while (isOccupied(newFruit));

  return newFruit;
 };

 // Restart game
 const restartGame = () => {
  setSnake(INITIAL_SNAKE);
  setGameOver(false);
  setFruit(generateFruit());
  setPoints(0);
  directionRef.current = null;
  if (intervalRef.current) clearInterval(intervalRef.current);
  setPause(false);
 };

 return (
  <div className="flex flex-col items-center shadow-[0_0_200px_#00000080] rounded-xl">
   <div className="text-white text-3xl font-bold p-2">{points}</div>
   <div className="relative bg-gradient-to-tl from-cyan-400 via-indigo-600 to-rose-900 rounded-md overflow-hidden">
    {/* Game over */}
    {gameOver && (
     <div className="absolute w-full h-full bg-black/60 flex flex-col items-center justify-evenly text-white">
      <h1 className="text-3xl font-bold">Game Over!</h1>
      <div className="flex flex-col gap-2 items-center">
       <div className="border-2 border-white h-10 w-32 rounded-xl">
        <MdOutlineSpaceBar className="w-full h-full" />
       </div>
       Press spacebar to resume
      </div>
     </div>
    )}
    {/* Game paused */}
    {pause && !gameOver && (
     <div className="absolute w-full h-full bg-black/60 flex flex-col items-center justify-evenly text-white">
      <h1 className="text-3xl font-bold">Game Paused!</h1>
      <div className="flex flex-col gap-2 items-center">
       <div className="border-2 border-white h-10 w-10 p-2 rounded-xl">
        <FaLongArrowAltUp className="w-full h-full" />
       </div>
       <div className="flex gap-2">
        <div className="border-2 border-white h-10 w-10 p-2 rounded-xl">
         <FaLongArrowAltLeft className="w-full h-full" />
        </div>
        <div className="border-2 border-white h-10 w-10 p-2 rounded-xl">
         <FaLongArrowAltDown className="w-full h-full" />
        </div>
        <div className="border-2 border-white h-10 w-10 p-2 rounded-xl">
         <FaLongArrowAltRight className="w-full h-full" />
        </div>
       </div>
       Press any key to resume
      </div>
     </div>
    )}
    {/* Game resumed */}
    {Array.from({ length: BOARD_SIZE }).map((_, row) => (
     <div
      key={row}
      className="flex justify-center"
     >
      {Array.from({ length: BOARD_SIZE }).map((_, col) => {
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
   </div>
  </div>
 );
};

export default Game;
