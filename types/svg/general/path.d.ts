/**
 * @description Parse a path "d" attribute into an array of objects,
 * where each object contains a command, and the numerical values.
 * @param {string} d the "d" attribute of a path.
 */
export function parsePathCommands(d: string): {
    command: string;
    values: number[];
}[];
export function parsePathCommandsWithEndpoints(d: any): {
    end: any;
    start: any;
    command: string;
    values: number[];
}[];
export namespace pathCommandNames {
    let m: string;
    let l: string;
    let v: string;
    let h: string;
    let a: string;
    let c: string;
    let s: string;
    let q: string;
    let t: string;
    let z: string;
}
//# sourceMappingURL=path.d.ts.map