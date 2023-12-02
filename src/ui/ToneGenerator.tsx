import ToggleDiv from './ToggleDiv';

export default function ToneGenerator() {
    return (
        <ToggleDiv title='Tone Generator'>
            <div className='flex flex-col items-center gap-6'>
                <input className='text-4xl bg-transparent text-center border-b-2 border-dashed outline-none pb-2 w-40' defaultValue={"152 Hz"}></input>
                <div className='tone-gen-controls flex flex-row gap-0.5'>
                    <button className="disabled:from-[#282828] disabled:to-[#282828] text-sm disabled:cursor-no-drop transition rounded-l-full text-center flex justify-center items-center h-12 w-[3.25rem] bg-gradient-to-b from-[#303030] to-[#282828]">-10</button>
                    <button className="disabled:from-[#282828] disabled:to-[#282828] text-sm disabled:cursor-no-drop transition text-center flex justify-center items-center h-12 w-12 bg-gradient-to-b from-[#303030] to-[#282828]">-1</button>
                    <button className="disabled:from-[#282828] disabled:to-[#282828] text-sm disabled:cursor-no-drop transition text-center flex justify-center items-center h-12 w-12 bg-gradient-to-b from-[#303030] to-[#282828]">
                    <img className='h-6' src='icons/play-sidebar.svg'></img>
                    </button>
                    <button className="disabled:from-[#282828] disabled:to-[#282828] text-sm disabled:cursor-no-drop transition text-center flex justify-center items-center h-12 w-12 bg-gradient-to-b from-[#303030] to-[#282828]">+1</button>
                    <button className="disabled:from-[#282828] disabled:to-[#282828] text-sm disabled:cursor-no-drop transition rounded-r-full text-center flex justify-center items-center h-12 w-[3.25rem] bg-gradient-to-b from-[#303030] to-[#282828]">+10</button>
                </div>
            </div>
        </ToggleDiv>
    )
}