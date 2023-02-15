/* Math (c) Kraft, MIT License */
import * as encloses from './encloses.js';
import * as overlap from './overlap.js';
import * as intersect$1 from './intersect.js';
import * as clip from './clip.js';
import * as split from './split.js';

const intersect = {
	...encloses,
	...overlap,
	...intersect$1,
	...clip,
	...split,
};

export { intersect as default };
