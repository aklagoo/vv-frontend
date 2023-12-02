export function dateToDateTime(date: Date): string {
  const dateString = date.toLocaleDateString("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  });
  return dateString;
}

type HSLColor = [number, number, number];

export function msToMss(ms: number): string {
  const milis = (ms % 1000).toString().padStart(3, '0');
  const secs = (Math.floor(ms / 1000) % 60).toString().padStart(2, '0');
  const mins = Math.floor(ms / 60 / 1000).toString().padStart(2, '0');
  return `${mins}:${secs}.${milis}`;
}

export function generateColorMap(maxVal: number, startColor: HSLColor, endColor: HSLColor, reverse: boolean = false): string[] {
  const hDist = ((reverse? endColor[0] + 360: endColor[0]) - startColor[0]) / (maxVal - 1);
  const sDist = (endColor[1] - startColor[1]) / (maxVal - 1);
  const lDist = (endColor[2] - startColor[2]) / (maxVal - 1);
  let hStart = startColor[0], sStart = startColor[1], lStart = startColor[2];
  console.log(sDist, lDist);
  const colorMap = [];
  for(let i = 0; i < maxVal; i++) {
    colorMap.push(`hsl(${Math.round(hStart)}deg ${Math.round(sStart)}% ${Math.round(lStart)}%)`);
    hStart = hStart + hDist;
    sStart = sStart + sDist;
    lStart = lStart + lDist;
  }
  return colorMap;
}

export function generateLogArray(binCount: number): number[] {
  const logArray = [];
  for(let i = 1; i <= binCount; i++) {
    logArray.push(Math.log(i+1) - Math.log(i));
  }
  return logArray;
}
