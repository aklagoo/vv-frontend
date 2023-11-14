/* eslint-disable @typescript-eslint/no-explicit-any */
type EventType = "onBeginRec" | "onEndRec" | "onError" | "onInitError" | "onAuthError" | "onInit";

class AudioController {
  chunks: Blob[] = [];
  clipLinks: string[] = [];
  recorder: MediaRecorder | null = null;
  eventListeners: Partial<Record<EventType, (args?: any) => undefined>> = {};

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

  init() {
    if(!this.recorder && navigator && navigator.mediaDevices) {
      /* Initialize the recorder. */
      navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.onstart = () => {
          this.emit('onBeginRec');
        }
        this.recorder.ondataavailable = (e) => this.chunks.push(e.data);
        this.recorder.onstop = () => {
          const clip = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
          const clipURL = window.URL.createObjectURL(clip);
          this.clipLinks.push(clipURL);
          this.chunks = [];
          this.emit('onEndRec', clipURL);
        }
        this.emit("onInit");
      }).catch(e => {
        this.emit('onError', { event: 'onInitError' ,error: e });
        this.emit('onInitError', { error: e })
      });
    }
    else {
      this.emit('onAuthError', { error: new Error("Could not get authorization to record audio.") })
    }
  }

  beginRec() {
    if(this.recorder === null) throw new Error("AudioController not initialized.");
    this.recorder.start();
  }

  endRec() {
    if(this.recorder === null) throw new Error("AudioController not initialized.");
    this.recorder?.stop();
  }
}

export default AudioController;
