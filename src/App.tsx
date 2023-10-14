import { MutableRefObject, useRef, useState } from 'react'

function App() {
  const [recPerm, setRecPerm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recorder: MutableRefObject<null | MediaRecorder> = useRef(null);
  const chunks = useRef<Blob[]>([]);
  const clips = useRef<string[]>([]);

  if(!recorder.current && navigator && navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
      recorder.current = new MediaRecorder(stream);

      // Add recorder event handlers.
      recorder.current.ondataavailable = (e) => chunks.current.push(e.data)
      recorder.current.onstop = () => {
        const clip = new Blob(chunks.current, { type: "audio/ogg; codecs=opus" });
        const clipURL = window.URL.createObjectURL(clip);
        clips.current.push(clipURL);
        setIsRecording(false);
        chunks.current = [];
      }

      setRecPerm(true);
    }).catch(() => setRecPerm(false))
  }

  const startRecording = () => {
    recorder.current?.start();
    setIsRecording(true);
  };

  const stopRecording = () => recorder.current?.stop();
  const onClickRecording = () => { (!isRecording)? startRecording(): stopRecording(); }

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
