import Spectrogram from "./Spectrogram";
import { dateToDateTime } from "./utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type EventType = "onBeginRec" | "onEndRec" | "onError" | "onInitError" | "onAuthError" | "onInit";

class AudioController {
  chunks: Blob[] = [];
  clipLinks: string[] = [];
  mediaRecorder: MediaRecorder | null = null;
  eventListeners: Partial<Record<EventType, (args?: any) => undefined>> = {};
  recordingContext: AudioContext = new AudioContext();
  analyser: AnalyserNode;
  spectrogram: Spectrogram | null = null;
  startTime: number = 0;

  constructor() {
    this.analyser = this.recordingContext.createAnalyser();
    this.analyser.fftSize = 4096;
    this.recordingContext.suspend();
  }

  addEventHandler(event: EventType, callback: (args?: any) => undefined) {
    this.eventListeners[event] = callback;
  }

  emit(event: EventType, args?: any) {
    const listener = this.eventListeners[event];
    if(listener === undefined) return;
    if(args !== undefined)
      listener(args);
    else
      listener();
  }

  init(canvasCtx: CanvasRenderingContext2D) {
    this.spectrogram = new Spectrogram(canvasCtx, this.analyser);
    if(!this.mediaRecorder && navigator && navigator.mediaDevices) {
      /* Initialize the recorder. */
      navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        /* Connect the recorder stream to the context. */
        this.recordingContext.createMediaStreamSource(stream).connect(this.analyser);

        /* Set up the recorder. */
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.onstart = () => {
          this.emit('onBeginRec');
          this.startTime = new Date().getTime();
        }
        this.mediaRecorder.ondataavailable = (e) => {
          this.chunks.push(e.data);
        };
        this.mediaRecorder.onstop = () => {
          const clip = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
          const clipURL = window.URL.createObjectURL(clip);
          this.clipLinks.push(clipURL);
          this.chunks = [];
          const date = new Date();
          const duration = date.getTime() - this.startTime;
          const timestamp = dateToDateTime(date);
          this.emit('onEndRec', { url: clipURL, duration, timestamp });
        }

        this.emit("onInit");
      }).catch(e => {
        this.emit('onError', { event: 'onInitError', error: e });
        this.emit('onInitError', { error: e })
      });
    }
    else {
      this.emit('onAuthError', { error: new Error("Could not get authorization to record audio.") })
    }
  }

  beginRec() {
    if(this.mediaRecorder === null) throw new Error("AudioController not initialized.");
    this.recordingContext.resume();
    this.mediaRecorder.start();
    if(this.spectrogram !== undefined && this.spectrogram !== null)
      this.spectrogram.start();
  }

  endRec() {
    if(this.mediaRecorder === null) throw new Error("AudioController not initialized.");
    this.recordingContext.suspend();
    this.mediaRecorder?.stop();
    if(this.spectrogram !== undefined && this.spectrogram !== null)
      this.spectrogram.stop();
  }
}

export default AudioController;
