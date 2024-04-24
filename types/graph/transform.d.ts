export function unitize(graph: FOLD): FOLD;
export function translate2(graph: FOLD, translation: [number, number] | [number, number, number]): FOLD;
export function translate3(graph: FOLD, translation: [number, number] | [number, number, number]): FOLD;
export function translate(graph: FOLD, translation: [number, number] | [number, number, number]): FOLD;
export function scaleUniform2(graph: FOLD, scaleAmount?: number, origin?: [number, number] | [number, number, number]): FOLD;
export function scaleUniform3(graph: FOLD, scaleAmount?: number, origin?: [number, number] | [number, number, number]): FOLD;
export function scaleUniform(graph: FOLD, scaleAmount?: number, origin?: [number, number] | [number, number, number]): FOLD;
export function scale2(graph: FOLD, scaleAmounts?: [number, number] | [number, number, number], origin?: [number, number] | [number, number, number]): FOLD;
export function scale3(graph: FOLD, scaleAmounts?: [number, number] | [number, number, number], origin?: [number, number] | [number, number, number]): FOLD;
export function scale(graph: FOLD, scaleAmounts?: [number, number] | [number, number, number], origin?: [number, number] | [number, number, number]): FOLD;
export function transform({ vertices_coords }: FOLD, matrix: number[]): [number, number] | [number, number, number][];
export function rotate(graph: FOLD, angle: number, vector?: number[], origin?: number[]): FOLD;
export function rotateX(graph: FOLD, angle: number, origin?: number[]): FOLD;
export function rotateY(graph: FOLD, angle: number, origin?: number[]): FOLD;
export function rotateZ(graph: FOLD, angle: number, origin?: number[]): FOLD;
//# sourceMappingURL=transform.d.ts.map