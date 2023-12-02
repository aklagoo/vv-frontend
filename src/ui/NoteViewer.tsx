import { MutableRefObject, useRef, useState } from "react";
import ToggleDiv from "./ToggleDiv";


export default function NoteViewer() {
    const [isEditing, setIsEditing] = useState(false);
    const textRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
    const lastVal: MutableRefObject<string> = useRef("");

    const onEdit = () => {
        lastVal.current = textRef.current? textRef.current.value: "";
        setIsEditing(true);
    }

    const onCancel = () => {
        setIsEditing(false);
        if (textRef.current) textRef.current.value = lastVal.current;
    }

    return (
        <ToggleDiv title='Note'>
            <div className='flex flex-col gap-6'>
            <div className='subheading flex flex-row justify-between gap-3'>
                <p className='text-xs text-[#808080] whitespace-nowrap truncate'>The note associated with the current recording.</p>
                <div className="note-edit-controls flex flex-row gap-2">
                    {
                        isEditing? (
                            <>
                                <button onClick={onCancel}><img src='icons/cancel.svg' className='w-4'></img></button>
                                <button onClick={() => setIsEditing(false)}><img src='icons/done.svg' className='w-4'></img></button>
                            </>
                        ): (<button onClick={onEdit}><img src='icons/edit.svg' className='w-4'></img></button>)
                    }
                </div>
            </div>
            <textarea
                className={`${isEditing? "bg-[#181818]": "bg-transparent"} rounded-lg p-2 h-48 overflow-y-auto text-sm outline-none resize-none`}
                placeholder='Empty.'
                disabled={!isEditing}
                ref={textRef}
            ></textarea>
            </div>
        </ToggleDiv>
    );
}