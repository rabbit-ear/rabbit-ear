/* Math (c) Kraft, MIT License */
import * as vectors from './vectors.js';
import * as matrix2 from './matrix2.js';
import * as matrix3 from './matrix3.js';
import * as matrix4 from './matrix4.js';
import * as quaternion from './quaternion.js';

/**
 * Math (c) Kraft
 */

const algebra = {
	...vectors,
	...matrix2,
	...matrix3,
	...matrix4,
	...quaternion,
};

export { algebra as default };
