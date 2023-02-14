/* Math (c) Kraft, MIT License */
import * as constants from './constants.js';
import * as functions from './functions.js';
import * as types from './types.js';
import * as arrays from './arrays.js';
import * as numbers from './numbers.js';
import * as search from './search.js';
import * as sort from './sort.js';

const general = {
	...constants,
	...functions,
	...types,
	...arrays,
	...numbers,
	...search,
	...sort,
};

export { general as default };
