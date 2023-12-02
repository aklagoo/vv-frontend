import { ReactNode, useState } from "react";


interface ToggleDivProps {
    title: string;
    children?: ReactNode;
    padding?: boolean;
}


export default function ToggleDiv(props: ToggleDivProps) {
    const [hidden, setHidden] = useState(false);

    const padding = props.padding? props.padding: true;

    return (
        <div className="overflow-hidden">
            <div className='toggle-header flex flex-row h-8 px-4 gap-4 bg-[#181818] items-center' onClick={() => setHidden(!hidden)}>
              <button><img src='icons/dropdown.svg' className={"transition-transform " + (hidden? "-rotate-90": "")}></img></button>
              <p className='uppercase text-[0.675rem] font-medium tracking-[.25em]'>{props.title}</p>
            </div>
            <div className={ `${hidden? "h-0 opacity-0": ""} transition-all overflow-hidden ${(padding && !hidden)? "p-4": ""}` }>
                <div className={"toggle-body transition-transform " + (hidden? "-translate-y-[calc(100%+32px)]": "")}>{props.children}</div>
            </div>
        </div>
    )
}