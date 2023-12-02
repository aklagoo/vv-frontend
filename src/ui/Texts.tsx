import { useState } from "react";
import ToggleDiv from "./ToggleDiv";

export default function Texts() {
    const [selected,] = useState(null);
    return (
        <ToggleDiv title="Texts">
            <div className='text-select flex flex-col gap-6'>
                <button className="text-sm text-left px-4 py-3 rounded-md w-full bg-gradient-to-b from-[#303030] to-[#282828]">
                    {(selected === null)? "Select a text...": "Crate"}
                </button>
                <div className="text-contents rounded-lg p-2 h-48 overflow-y-auto text-sm">
                    <p>Hello!</p>
                </div>
            </div>
        </ToggleDiv>
    )
}