import { generateColorMap, generateLogArray } from "./utils";

type SpectrogramMode = "linear" | "logarithmic";

export default class Spectrogram {
    ctx: CanvasRenderingContext2D;
    binCount: number = -1;
    hasStarted: boolean = false;
    analyser: AnalyserNode;
    enabled: boolean = false;
    colorMap: string[];
    unitY: number;
    data: Uint8Array;
    mode: SpectrogramMode;
    logArray: number[];
    draw: () => void;
    constructor(context: CanvasRenderingContext2D, analyser: AnalyserNode) {
        this.ctx = context;
        this.binCount = analyser.frequencyBinCount;
        this.analyser = analyser;
        this.draw = this.draw_.bind(this);
        this.colorMap = generateColorMap(256, [272, 28, 5], [136, 43, 46]);
        this.unitY = this.ctx.canvas.height / this.binCount;
        this.data = new Uint8Array(this.binCount);
        this.mode = "logarithmic";
        this.logArray = generateLogArray(this.binCount);

        this.ctx.fillStyle = this.colorMap[0];
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    start() {
        this.enabled = true;
        requestAnimationFrame(this.draw);
    }
    stop() {
        this.enabled = false;
    }

    getWidth(i: number): number {
        if(this.mode == "linear")
            return this.unitY;
        else
            return this.logArray[i] * 20;
    }

    draw_() {
        const imageData = this.ctx.getImageData(1, 0, this.ctx.canvas.width-1, this.ctx.canvas.height);
        this.ctx.putImageData(imageData, 0, 0);

        if(!this.enabled) return;
        requestAnimationFrame(this.draw);
        this.analyser.getByteFrequencyData(this.data);
        const barWidth = 1;

        let startY: number = this.ctx.canvas.height;
        for(let i = 0; i < this.data.length; i++) {
            this.ctx.fillStyle = this.colorMap[this.data[i]];
            const barHeight = this.getWidth(i);
            this.ctx.fillRect(this.ctx.canvas.width - barWidth, startY - barHeight, barWidth, barHeight);
            startY = startY - barHeight;
        }
    }
}