/* Math (c) Kraft, MIT License */
import * as encloses from './encloses.js';
import * as overlap from './overlap.js';
import * as intersect from './intersect.js';
import * as clip from './clip.js';
import * as split from './split.js';
import intersect$1 from './intersectMethod.js';

/**
 * Math (c) Kraft
 */

const intersectMethods = {
	...encloses,
	...overlap,
	...intersect,
	...clip,
	...split,
	intersect: intersect$1,
};

export { intersectMethods as default };
