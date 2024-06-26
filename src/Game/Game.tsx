import { useEffect, useState, useCallback, useRef } from "react";
import { twMerge } from "tailwind-merge";

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
 const directionRef = useRef<string | null>(null);
 const intervalRef = useRef<NodeJS.Timeout | null>(null);

 // Changing direction
 const handleKeyDown = useCallback(
  (event: KeyboardEvent) => {
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
  },
  [gameOver, pending]
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
  if (!gameOver) {
   intervalRef.current = setInterval(moveSnake, 300);

   return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
   };
  }
 }, [gameOver]);

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
  directionRef.current = null;
  if (intervalRef.current) clearInterval(intervalRef.current);
 };

 return (
  <div className="relative bg-gradient-to-tl from-cyan-400 via-indigo-600 to-rose-900">
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
          "h-full w-full rounded-md",
          isSnakeCell &&
           "bg-gradient-radial from-green-500 to-green-600",
          isSnakeHead &&
           "bg-gradient-radial from-yellow-500 to-yellow-600",
          isFruitCell &&
           "bg-gradient-radial from-red-500 to-red-600 rounded-xl"
         )}
        ></div>
       </div>
      );
     })}
    </div>
   ))}
  </div>
 );
};

export default Game;
