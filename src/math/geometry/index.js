/* Math (c) Kraft, MIT License */
import * as convexHull from './convexHull.js';
import * as line from './line.js';
import * as nearest from './nearest.js';
import * as polygon from './polygon.js';
import * as radial from './radial.js';
import straightSkeleton from './straightSkeleton.js';

/**
 * Math (c) Kraft
 */

const geometry = {
	...convexHull,
	...line,
	...nearest,
	...polygon,
	...radial,
	straightSkeleton,
};

export { geometry as default };
