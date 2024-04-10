export { makeArrowPaths as default };
/**
 * @description
 * @param {{
 *   points: [number, number, number, number],
 *   padding: number,
 *   bend: number,
 *   pinch: number,
 * }} options
 */
declare function makeArrowPaths(options: {
    points: [number, number, number, number];
    padding: number;
    bend: number;
    pinch: number;
}): {
    line: string;
    tail: string;
    head: string;
};
