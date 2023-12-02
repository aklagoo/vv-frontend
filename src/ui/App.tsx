import { MutableRefObject, useEffect, useRef, useState } from 'react';
import AudioController from '../lib/AudioController.js';
import { msToMss } from '../lib/utils.js';
import ToggleDiv from './ToggleDiv.js';


interface ClipDetails {
  url: string;
  duration: number;
  timestamp: string;
  title: string;
}


function App() {
  const audioController: MutableRefObject<AudioController> = useRef(new AudioController());
  const [recPerm, setRecPerm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const clips = useRef<ClipDetails[]>([]);
  const canvas: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const timerIntervalRef: MutableRefObject<number | null> = useRef(null);
  const timerRef: MutableRefObject<HTMLParagraphElement | null> = useRef(null);
  const startTime: MutableRefObject<number | null> = useRef(0);

  /** Add event handlers. */
  audioController.current.addEventHandler("onInit", () => { setRecPerm(true); });
  audioController.current.addEventHandler("onBeginRec", () => {
    setIsRecording(true);
    if(timerRef.current === null) return;
    timerRef.current.innerHTML = "00:00.000";
    startTime.current = new Date().getTime();
    timerIntervalRef.current = setInterval(() => {
      if(startTime.current === null) return;
      if(timerRef.current === null) return;

      timerRef.current.innerHTML = msToMss(Date.now() - startTime.current);
    }, 1);
  });
  audioController.current.addEventHandler("onEndRec", (clipDetails_) => {
    if (timerIntervalRef.current !== null) clearInterval(timerIntervalRef.current);
    const clipDetails: ClipDetails = {
      url: clipDetails_.url,
      duration: clipDetails_.duration,
      timestamp: clipDetails_.timestamp,
      title: ''
    };
    clips.current.push(clipDetails);
    setIsRecording(false);
  });

  useEffect(() => {
    /** Initialize the controller */
    const context = canvas.current?.getContext('2d');
    if(context === undefined || context === null) return;
    audioController.current.init(context);
  }, []);

  const onClickRecording = () => {
    if(isRecording)
      audioController.current.endRec();
    else
      audioController.current.beginRec();
  }

  return (
    <div className='h-screen w-screen bg-[#202020] flex flex-col text-zinc-300'>
      <nav className='w-full border-b-2 border-[#181818] h-16 flex flex-row'>
        <div className='file-controls w-80 flex flex-row px-2 py-2 gap-4 border-r-2  border-[#181818]'>
          <button className='text-sm text-center rounded-full w-full align-middle bg-gradient-to-b from-[#303030] to-[#282828]'>+ New recording</button>
          <button className='rounded-full text-center flex justify-center items-center h-12 w-16 bg-gradient-to-b from-[#181818] to-[#101010]'>
            <img className='h-6' src='icons/upload-navbar.svg'></img>
          </button>
        </div>
        <div className='main-nav flex flex-row flex-grow justify-between px-2 py-2'>
          <div className='playback-controls flex flex-row gap-4'>
            <button
              className="disabled:from-[#282828] disabled:to-[#282828] disabled:cursor-no-drop transition rounded-full text-center flex justify-center items-center h-12 w-12 bg-gradient-to-b from-[#303030] to-[#282828]"
              disabled={isRecording}
            >
              <img className='h-6' src='icons/play-sidebar.svg'></img>
            </button>
            <button
              className="disabled:from-[#282828] disabled:to-[#282828] disabled:cursor-no-drop transition rounded-full text-center flex justify-center items-center h-12 w-12 bg-gradient-to-b from-[#303030] to-[#282828] disabled:bg-black"
              disabled={isRecording}
            >
              <img className='h-6' src='icons/reset-navbar.svg'></img>
            </button>
            <button
              className={
                `disabled:from-[#282828] disabled:to-[#282828] disabled:cursor-no-drop transition rounded-full text-center flex justify-center items-center h-12 w-12 bg-gradient-to-b from-[#303030] to-[#282828] ${isRecording? "shadow-[0px_0px_8px_2px_rgba(255,71,71,0.75)]": ""}`
              }
              disabled={!recPerm? true: false}
              onClick={onClickRecording}
            >
              <img className='h-6' src='icons/record-navbar.svg'></img>
            </button>
            <div className='font-mono text-lg w-36 h-12 rounded-lg bg-[#101010] shadow-[0_0_4px_0_rgba(0,0,0,0.25)_inset] flex justify-center items-center'>
              <p ref={timerRef}>00:00.000</p>
            </div>
          </div>
          <div className='extra-controls'>
            Yo?
          </div>
        </div>
      </nav>
      <div className='flex-grow flex'>
        <div className='w-80 border-r-2 border-zinc-950 overflow-y-auto'>
          {clips.current.map((clipDetails, index) => (
            <div key={index} className='flex flex-row justify-between px-8 py-4 border-b-2 border-[#181818]'>
              <div className='flex flex-col gap-2'>
                {clipDetails.title === ""? <h4 className='font-bold text-sm text-[#808080]'>...</h4>: <h4 className='font-bold text-sm'>{clipDetails.title}</h4>}
                <p className='font-light text-xs text-[#808080]'>{clipDetails.timestamp} <span className='font-semibold'>• {msToMss(clipDetails.duration)}</span></p>
              </div>
              <button><img src='icons/play-sidebar.svg'></img></button>
              <audio hidden={true} key={index} controls src={clipDetails.url}></audio>
            </div>
          ))
        }
        </div>
        <div className='flex-grow flex flex-row'>
          <article className='flex-grow'>
            <canvas ref={canvas} className='w-full h-full shadow-[0_0_8px_8px_rgba(0,0,0,0.50)_inset]'>
            </canvas>
          </article>
          <div className='tools-sidebar w-80 flex flex-col'>
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
            <ToggleDiv title='Note'>
              <div className='flex flex-col gap-6'>
                <div className='subheading flex flex-row justify-between'>
                  <p className='text-xs text-[#808080]'>The note associated with the current recording.</p>
                  <button><img src='icons/edit.svg' className='w-4'></img></button>
                </div>
                <textarea
                  className='bg-transparent focus-within:bg-[#181818] focus-within:text-[#808080] focus-within:italic rounded-lg p-2 h-48 overflow-y-auto text-sm outline-none resize-none'
                  placeholder='Add your notes here...'
                ></textarea>
              </div>
            </ToggleDiv>
          </div>
        </div>
      </div>
      <div className='absolute bottom-4 right-4 flex flex-col items-end'>
        <p className={'max-w-sm shadow-sm text-sm shadow-red-800 bg-red-500 m-2 p-4 rounded-md' + (recPerm? ' hidden': '')}>
          Please grant permission to the microphone.
        </p>
        <p className='max-w-sm shadow-sm text-sm shadow-red-800 bg-red-500 m-2 p-4 rounded-md'>Error 1</p>
      </div>
    </div>
  )
}

export default App
