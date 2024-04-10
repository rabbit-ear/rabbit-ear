export function axiom1(point1: any, point2: any): {
    vector: [number, number];
    origin: any;
}[];
export function normalAxiom1(point1: [number, number], point2: [number, number]): [UniqueLine];
export function axiom2(point1: [number, number], point2: [number, number]): [VecLine];
export function normalAxiom2(point1: [number, number], point2: [number, number]): [UniqueLine];
export function axiom3(line1: VecLine, line2: VecLine): [VecLine?, VecLine?];
export function normalAxiom3(line1: UniqueLine, line2: UniqueLine): [UniqueLine?, UniqueLine?];
export function axiom4({ vector }: VecLine, point: [number, number]): [VecLine];
export function normalAxiom4(line: UniqueLine, point: number[]): [UniqueLine];
export function axiom5(line: VecLine, point1: number[], point2: number[]): [VecLine, VecLine?];
export function normalAxiom5(line: UniqueLine, point1: number[], point2: number[]): [UniqueLine?, UniqueLine?];
export function axiom6(line1: VecLine, line2: VecLine, point1: number[], point2: number[]): [VecLine?, VecLine?, VecLine?];
export function normalAxiom6(line1: UniqueLine, line2: UniqueLine, point1: number[], point2: number[]): [UniqueLine?, UniqueLine?, UniqueLine?];
export function axiom7(line1: VecLine, line2: VecLine, point: number[]): [VecLine?];
export function normalAxiom7(line1: UniqueLine, line2: UniqueLine, point: number[]): [UniqueLine?];
export function axiom(number: number, ...args: any[]): VecLine[];
export function normalAxiom(number: number, ...args: any[]): UniqueLine[];
