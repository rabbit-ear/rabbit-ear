/**
 * 3x4 matrix methods. the fourth column is a translation vector
 * these methods depend on arrays of 12 items, 3x3 matrices won't work.
 */
/**
 * @description the identity matrix for 3x3 matrices
 * @constant {number[]}
 * @default
 */
export const identity3x3: readonly number[];
/**
 * @description the identity matrix for 3x4 matrices (zero translation)
 * @constant {number[]}
 * @default
 */
export const identity3x4: readonly number[];
export function isIdentity3x4(m: number[]): boolean;
export function multiplyMatrix3Vector3(m: number[], vector: number[]): number[];
export function multiplyMatrix3Line3(m: number[], vector: number[], origin: number[]): VecLine;
export function multiplyMatrices3(m1: number[], m2: number[]): number[];
export function determinant3(m: number[]): number;
export function invertMatrix3(m: number[]): number[] | undefined;
export function makeMatrix3Translate(x?: number, y?: number, z?: number): number[];
export function makeMatrix3RotateX(angle: number, origin?: number[]): number[];
export function makeMatrix3RotateY(angle: number, origin?: number[]): number[];
export function makeMatrix3RotateZ(angle: number, origin?: number[]): number[];
export function makeMatrix3Rotate(angle: number, vector?: number[], origin?: number[]): number[];
export function makeMatrix3Scale(scale?: number[], origin?: number[]): number[];
export function makeMatrix3UniformScale(scale?: number, origin?: number[]): number[];
export function makeMatrix3ReflectZ(vector: number[], origin?: number[]): number[];
