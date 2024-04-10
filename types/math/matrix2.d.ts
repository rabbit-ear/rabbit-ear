/**
 * Rabbit Ear (c) Kraft
 */
/**
 * 2x3 matrix methods for two dimensional transformations.
 * the third column is a 2D translation vector
 */
/**
 * @description the identity matrix for 2x2 matrices
 * @constant {number[]}
 * @default
 */
export const identity2x2: number[];
/**
 * @description the identity matrix for 2x3 matrices (zero translation)
 * @constant {number[]}
 * @default
 */
export const identity2x3: number[];
export function multiplyMatrix2Vector2(matrix: number[], vector: number[]): number[];
export function multiplyMatrix2Line2(matrix: number[], vector: number[], origin: number[]): VecLine;
export function multiplyMatrices2(m1: number[], m2: number[]): number[];
export function determinant2(m: number[]): number;
export function invertMatrix2(m: number[]): number[] | undefined;
export function makeMatrix2Translate(x?: number, y?: number): number[];
export function makeMatrix2Scale(scale?: number[], origin?: number[]): number[];
export function makeMatrix2UniformScale(scale?: number, origin?: number[]): number[];
export function makeMatrix2Rotate(angle: number, origin?: number[]): number[];
export function makeMatrix2Reflect(vector: number[], origin?: number[]): number[];
