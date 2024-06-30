import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface DropDownListProps {
 gameResumed: boolean;
 currentOption: string;
 options: { label: string; value: number }[];
 changeOption: (label: string, value: number) => void;
}

const DropDownList = ({
 gameResumed,
 currentOption,
 options,
 changeOption
}: DropDownListProps) => {
 const [shown, setShown] = useState(false);

 const handleShowOptions = () => {
  if (gameResumed) return;
  setShown((shown) => !shown);
 };

 return (
  <div
   tabIndex={1}
   onClick={handleShowOptions}
   className={twMerge(
    "relative text-white font-bold cursor-pointer",
    gameResumed && "cursor-not-allowed text-gray-400"
   )}
  >
   <div
    className={twMerge(
     "bg-black/50 py-2 w-24 text-center rounded-[20px] transition-all hover:bg-black/70",
     shown && "rounded-[20px_20px_0_0]",
     gameResumed && "hover:bg-black/50"
    )}
   >
    {currentOption}
   </div>
   <div
    className={twMerge(
     "w-full absolute z-10 flex flex-col items-center origin-top transition-all scale-0 rounded-[20px] overflow-hidden",
     shown && "rounded-[0_0_20px_20px] scale-100"
    )}
   >
    {options.map((option) => (
     <button
      onClick={() => changeOption(option.label, option.value)}
      className="w-full p-2 bg-black/50 hover:bg-black/70"
     >
      {option.label}
     </button>
    ))}
   </div>
  </div>
 );
};

export default DropDownList;
