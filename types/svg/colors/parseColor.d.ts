/**
 * @description input a color as a string and return the
 * same color as a hex value string. This supports CSS/SVG
 * color strings like named colors, hex colors, rgb(), hsl().
 * @param {string} string a CSS/SVG color string in any form
 * @returns {string} a hex-color form of the input color string.
 */
export function parseColorToHex(string: string): string;
/**
 * @description input a color as a string and get back the RGB
 * values as three numbers in an array. This supports CSS/SVG
 * color strings like named colors, hex colors, rgb(), hsl().
 * @param {string} string a CSS/SVG color string in any form
 * @returns {number[] | undefined} red green blue values between 0 and 255,
 * with possible 4th value between 0 and 1.
 */
export function parseColorToRgb(string: string): number[] | undefined;
//# sourceMappingURL=parseColor.d.ts.map