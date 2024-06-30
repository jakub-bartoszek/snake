import { useCallback, useEffect, useRef, useState } from "react";

export interface Fruit {
 x: number;
 y: number;
}

export interface Snake {
 x: number;
 y: number;
}

interface useGameLogicProps {
 boardSizeValue: number;
 snakeSpeedValue: number;
}

const useGameLogic = ({
 boardSizeValue,
 snakeSpeedValue
}: useGameLogicProps) => {
 const [snake, setSnake] = useState<Snake[]>([
  {
   x: Math.floor(Math.random() * boardSizeValue),
   y: Math.floor(Math.random() * boardSizeValue)
  }
 ]);
 const [fruit, setFruit] = useState<Fruit>({
  x: Math.floor(Math.random() * boardSizeValue),
  y: Math.floor(Math.random() * boardSizeValue)
 });
 const [gameOver, setGameOver] = useState(false);
 const [pause, setPause] = useState(false);
 const [points, setPoints] = useState(0);
 const [pending, setPending] = useState(false);
 const directionRef = useRef<string | null>(null);
 const intervalRef = useRef<NodeJS.Timeout | null>(null);

 useEffect(() => {
  setSnake([
   {
    x: Math.floor(Math.random() * boardSizeValue),
    y: Math.floor(Math.random() * boardSizeValue)
   }
  ]);
  setFruit(generateFruit(boardSizeValue, snake));
 }, [boardSizeValue]);

 const generateFruit = (boardSize: number, snake: Snake[]) => {
  let newFruit: Fruit;
  do {
   newFruit = {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize)
   };
  } while (
   snake.some(
    (cell) => cell.x === newFruit.x && cell.y === newFruit.y
   )
  );
  return newFruit;
 };

 const moveSnake = useCallback(() => {
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
    head.y >= boardSizeValue ||
    head.x < 0 ||
    head.x >= boardSizeValue ||
    newSnake
     .slice(1)
     .some((cell) => cell.x === head.x && cell.y === head.y)
   ) {
    setGameOver(true);
    return prevSnake;
   }

   newSnake.unshift(head);
   newSnake.pop();
   setPending(false);
   return newSnake;
  });
 }, [boardSizeValue]);

 useEffect(() => {
  if (!gameOver && !pause) {
   intervalRef.current = setInterval(moveSnake, snakeSpeedValue);
   return () => {
    if (intervalRef.current !== null) {
     clearInterval(intervalRef.current);
    }
   };
  } else if (pause && intervalRef.current !== null) {
   clearInterval(intervalRef.current);
  }
 }, [gameOver, pause, moveSnake, snakeSpeedValue]);

 const handleKeyDown = useCallback(
  (event: any) => {
   if (event.key === "p" || event.key === "P") {
    setPause((prevPause) => !prevPause);
    return;
   }
   if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
     event.key
    ) &&
    !gameOver
   ) {
    if (pause) {
     setPause(false);
    }
    setPending(true);
    directionRef.current = event.key.slice(5).toLowerCase();
   }
   if (event.key === " ") {
    if (gameOver) restartGame();
   }
  },
  [gameOver, pause]
 );

 useEffect(() => {
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
 }, [handleKeyDown]);

 const restartGame = useCallback(() => {
  setSnake([
   {
    x: Math.floor(Math.random() * boardSizeValue),
    y: Math.floor(Math.random() * boardSizeValue)
   }
  ]);
  setGameOver(false);
  setFruit(generateFruit(boardSizeValue, snake));
  setPoints(0);
  directionRef.current = null;
  if (intervalRef.current !== null) {
   clearInterval(intervalRef.current);
  }
  setPause(false);
 }, [boardSizeValue, snake]);

 useEffect(() => {
  const head = snake[0];
  if (head?.x === fruit.x && head?.y === fruit.y) {
   setSnake((prevSnake) => [...prevSnake, fruit]);
   setFruit(generateFruit(boardSizeValue, snake));
   setPoints(points + 1);
  }
 }, [snake, fruit, boardSizeValue, points]);

 return {
  directionRef,
  snake,
  fruit,
  gameOver,
  pause,
  points,
  restartGame,
  setPause
 };
};

export default useGameLogic;
