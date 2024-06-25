import { useEffect, useState, useCallback, useRef } from "react";

interface Fruit {
 x: number;
 y: number;
}

interface Snake {
 x: number;
 y: number;
}

const BOARD_SIZE = 9;
const INITIAL_SNAKE: Snake[] = [{ x: 4, y: 4 }];

const Game = () => {
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

 const [snake, setSnake] = useState<Snake[]>(INITIAL_SNAKE);
 const [fruit, setFruit] = useState<Fruit>(generateFruit());
 const [gameOver, setGameOver] = useState(false);
 const [pending, setPending] = useState(false);
 const directionRef = useRef<string | null>(null);
 const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

 useEffect(() => {
  window.addEventListener("keydown", handleKeyDown);

  return () => {
   window.removeEventListener("keydown", handleKeyDown);
  };
 }, [handleKeyDown]);

 useEffect(() => {
  if (!gameOver) {
   intervalRef.current = setInterval(moveSnake, 300);

   return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
   };
  }
 }, [gameOver]);

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

 useEffect(() => {
  const head = snake[0];

  if (head.y === fruit.y && head.x === fruit.x) {
   setSnake((prevSnake) => [...prevSnake, fruit]);
   setFruit(generateFruit());
  }
 }, [snake, fruit]);

 const restartGame = () => {
  setSnake(INITIAL_SNAKE);
  setGameOver(false);
  setFruit(generateFruit());
  directionRef.current = null;
  if (intervalRef.current) clearInterval(intervalRef.current);
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
      const isSnakeCell = snake.some(
       (cell) => cell.x === col && cell.y === row
      );
      const isFruitCell = fruit.x === col && fruit.y === row;

      return (
       <div
        key={col}
        className={`h-6 w-6 border-[1px] border-black ${
         isSnakeCell ? "bg-green-500" : ""
        } ${isFruitCell ? "bg-red-500" : ""}`}
       ></div>
      );
     })}
    </div>
   ))}
  </div>
 );
};

export default Game;
