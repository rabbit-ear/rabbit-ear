export function flattenFrame(graph: FOLD, frameNumber?: number): FOLD;
export function getFileFramesAsArray(graph: FOLD): FOLD[];
export function countFrames({ file_frames }: FOLD): number;
export function getFramesByClassName(graph: FOLD, className: string): FOLD[];
