/**
 * @description Convert a hex string into an array of
 * three numbers, the rgb values (between 0 and 1).
 * This ignores any alpha values.
 * @param {string} string a hex color code as a string
 * @returns {number[]} three values between 0 and 255
 * @linkcode Origami ./src/convert/svgParsers/colors/hexToRGB.js 10
 */
export function hexToRgb(string: string): number[];
/**
 * @description Convert hue-saturation-lightness values into
 * three RGB values, each between 0 and 1 (not 0-255).
 * @param {number} hue value between 0 and 360
 * @param {number} saturation value between 0 and 100
 * @param {number} lightness value between 0 and 100
 * @param {number | undefined} alpha the alpha component from 0 to 1
 * @returns {number[]} three values between 0 and 255, or four
 * if an alpha value is provided, where the fourth is between 0 and 1.
 * @linkcode Origami ./src/convert/svgParsers/colors/hexToRGB.js 10
 */
export function hslToRgb(hue: number, saturation: number, lightness: number, alpha: number | undefined): number[];
/**
 * @param {number} red the red component from 0 to 255
 * @param {number} green the green component from 0 to 255
 * @param {number} blue the blue component from 0 to 255
 * @param {number | undefined} alpha the alpha component from 0 to 1
 * @returns {string} hex string, with our without alpha.
 */
export function rgbToHex(red: number, green: number, blue: number, alpha: number | undefined): string;
//# sourceMappingURL=convert.d.ts.map