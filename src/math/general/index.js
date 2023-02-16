/* Math (c) Kraft, MIT License */
import * as constants from './constants.js';
import * as functions from './functions.js';
import * as get from './get.js';
import * as convert from './convert.js';
import * as arrays from './arrays.js';
import * as numbers from './numbers.js';
import * as search from './search.js';
import * as sort from './sort.js';
import typeOf from './typeOf.js';

/**
 * Math (c) Kraft
 */

const general = {
	...constants,
	...functions,
	...get,
	...convert,
	...arrays,
	...numbers,
	...search,
	...sort,
	typeof: typeOf,
};

export { general as default };
