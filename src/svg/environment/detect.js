/* svg (c) Kraft, MIT License */
import { str_undefined } from './strings.js';

/**
 * SVG (c) Kraft
 */

/**
 * @constant {boolean}
 * @note compare to "undefined", the string
 */
const isBrowser = typeof window !== str_undefined
	&& typeof window.document !== str_undefined;
/**
 * @constant {boolean}
 */
typeof process !== str_undefined
	&& process.versions != null
	&& process.versions.node != null;

export { isBrowser };
