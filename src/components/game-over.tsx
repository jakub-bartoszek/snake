import { MdOutlineSpaceBar } from "react-icons/md";

const GameOver = () => {
 return (
  <div className="absolute w-full h-full bg-black/60 flex flex-col items-center justify-evenly text-white">
   <h1 className="text-3xl font-bold">Game Over!</h1>
   <div className="flex flex-col gap-2 items-center">
    <div className="border-2 border-white h-10 w-32 rounded-xl">
     <MdOutlineSpaceBar className="w-full h-full" />
    </div>
    Press spacebar to try again
   </div>
  </div>
 );
};

export default GameOver;
