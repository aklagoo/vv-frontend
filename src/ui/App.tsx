import { MutableRefObject, useEffect, useRef, useState } from 'react';
import AudioController from '../lib/AudioController.js';


function App() {
  const audioController: MutableRefObject<AudioController> = useRef(new AudioController());
  const [recPerm, setRecPerm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const clips = useRef<string[]>([]);

  /** Add event handlers. */
  audioController.current.addEventHandler("onInit", () => { setRecPerm(true); });
  audioController.current.addEventHandler("onBeginRec", () => { setIsRecording(true); });
  audioController.current.addEventHandler("onEndRec", (clipURL: string) => {
    clips.current.push(clipURL);
    setIsRecording(false);
  });

  useEffect(() => {
    /** Initialize the controller */
    audioController.current.init();
  }, []);

  const onClickRecording = () => {
    if(isRecording)
      audioController.current.endRec();
    else
      audioController.current.beginRec();
  }

  return (
    <div className='h-screen w-screen bg-zinc-800 flex flex-col text-zinc-300'>
      <nav className='w-full border-b border-zinc-950 h-12'>
        <button type="button" onClick={onClickRecording} disabled={!recPerm? true: false}>{isRecording? "Stop": "Start"}</button>
        <button type="button">Play</button>
        <button type="button">Pause</button>
      </nav>
      <div className='flex-grow flex'>
        <div className='w-80 border-r border-zinc-950'>
          {clips.current.map((clip, index) => <audio key={index} controls src={clip}></audio>)}
        </div>
        <article className='flex-grow'>
          <canvas className='w-full h-full'>
          </canvas>
        </article>
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
