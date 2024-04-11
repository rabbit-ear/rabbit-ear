/**
 * 4x4 matrix methods. the fourth column is a translation vector
 * these methods depend on arrays of 16 items.
 */
/**
 * @description the identity matrix for 3x3 matrices
 * @constant {number[]}
 * @default
 */
export const identity4x4: readonly number[];
export function isIdentity4x4(m: number[]): boolean;
export function multiplyMatrix4Vector3(m: number[], vector: [number, number, number]): [number, number, number];
export function multiplyMatrix4Line3(m: number[], vector: [number, number, number], origin: [number, number, number]): VecLine;
export function multiplyMatrices4(m1: number[], m2: number[]): number[];
export function determinant4(m: number[]): number;
export function invertMatrix4(m: number[]): number[] | undefined;
export function makeMatrix4Translate(x?: number, y?: number, z?: number): number[];
export function makeMatrix4RotateX(angle: number, origin?: [number, number, number]): number[];
export function makeMatrix4RotateY(angle: number, origin?: [number, number, number]): number[];
export function makeMatrix4RotateZ(angle: number, origin?: [number, number, number]): number[];
export function makeMatrix4Rotate(angle: number, vector?: [number, number, number], origin?: [number, number, number]): number[];
export function makeMatrix4Scale(scale?: [number, number, number], origin?: [number, number, number]): number[];
export function makeMatrix4UniformScale(scale?: number, origin?: [number, number, number]): number[];
export function makeMatrix4ReflectZ(vector: [number, number], origin?: [number, number]): number[];
export function makePerspectiveMatrix4(FOV: number, aspect: number, near: number, far: number): number[];
export function makeOrthographicMatrix4(top: number, right: number, bottom: number, left: number, near: number, far: number): number[];
export function makeLookAtMatrix4(position: [number, number, number], target: [number, number, number], up: [number, number, number]): number[];
