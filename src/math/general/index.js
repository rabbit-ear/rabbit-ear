/* Math (c) Kraft, MIT License */
import * as constant from './constant.js';
import * as _function from './function.js';
import * as get from './get.js';
import * as convert from './convert.js';
import * as array from './array.js';
import * as number from './number.js';
import * as search from './search.js';
import * as sort from './sort.js';
import typeOf from './typeOf.js';

/**
 * Math (c) Kraft
 */

const general = {
	...constant,
	..._function,
	...get,
	...convert,
	...array,
	...number,
	...search,
	...sort,
	typeof: typeOf,
};

export { general as default };
