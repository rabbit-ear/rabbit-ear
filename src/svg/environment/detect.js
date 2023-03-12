/* svg (c) Kraft, MIT License */
import { str_undefined } from './strings.js';

const isBrowser = typeof window !== str_undefined
	&& typeof window.document !== str_undefined;
typeof process !== str_undefined
	&& process.versions != null
	&& process.versions.node != null;

export { isBrowser };
