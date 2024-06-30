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
 const directionQueue = useRef<string[]>([]);
 const directionRef = useRef<string | null>(null);
 const animationFrameRef = useRef<number | null>(null);
 const lastMoveTimeRef = useRef<number>(0);

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
   const currentDirection = directionQueue.current.length
    ? directionQueue.current.shift()
    : directionRef.current;

   if (!currentDirection) return prevSnake;

   directionRef.current = currentDirection;

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
   return newSnake;
  });
 }, [boardSizeValue]);

 const gameLoop = useCallback(
  (timestamp: number) => {
   if (!lastMoveTimeRef.current) lastMoveTimeRef.current = timestamp;
   const timeElapsed = timestamp - lastMoveTimeRef.current;

   if (timeElapsed > snakeSpeedValue) {
    moveSnake();
    lastMoveTimeRef.current = timestamp;
   }

   if (!gameOver && !pause) {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
   }
  },
  [moveSnake, snakeSpeedValue, gameOver, pause]
 );

 useEffect(() => {
  if (!gameOver && !pause) {
   animationFrameRef.current = requestAnimationFrame(gameLoop);
  } else if (animationFrameRef.current) {
   cancelAnimationFrame(animationFrameRef.current);
  }

  return () => {
   if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
   }
  };
 }, [gameOver, pause, gameLoop]);

 const handleKeyDown = useCallback(
  (event: any) => {
   if (event.key === "p" || event.key === "P") {
    setPause((prevPause) => !prevPause);
    return;
   }

   const currentDirection = directionRef.current;
   const newDirection = event.key.slice(5).toLowerCase();

   if (
    gameOver ||
    !["up", "down", "left", "right"].includes(newDirection)
   ) {
    if (event.key === " ") {
     if (gameOver) restartGame();
    }
    return;
   }

   if (
    (currentDirection === "up" && newDirection === "down") ||
    (currentDirection === "down" && newDirection === "up") ||
    (currentDirection === "left" && newDirection === "right") ||
    (currentDirection === "right" && newDirection === "left")
   ) {
    return;
   }

   if (pause) {
    setPause(false);
   }

   directionQueue.current.push(newDirection);
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
  directionQueue.current = [];
  if (animationFrameRef.current) {
   cancelAnimationFrame(animationFrameRef.current);
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
