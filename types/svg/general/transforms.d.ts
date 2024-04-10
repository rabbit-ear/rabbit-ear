/**
 * SVG (c) Kraft
 */
/** SVG transforms are in DEGREES ! */
/**
 * @description parse the value of a SVG transform attribute
 * @param {string} transform a CSS/SVG transform, for example
 * "translate(20 30) rotate(30) skewY(10)"
 * @returns {{ transform: string, parameters: number[] }[]} array of objects
 * representing method calls where the "transform" is the transform name and
 * the "parameters" is a list of floats.
 */
export function parseTransform(transform: string): {
    transform: string;
    parameters: number[];
}[];
export function transformStringToMatrix(string: any): any;
