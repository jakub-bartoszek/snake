import { FaLongArrowAltDown, FaLongArrowAltLeft, FaLongArrowAltRight, FaLongArrowAltUp } from "react-icons/fa";

const GamePaused = () => {
 return (
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
 );
};

export default GamePaused;
