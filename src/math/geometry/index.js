/* Math (c) Kraft, MIT License */
import * as convexHull from './convexHull.js';
import * as lines from './lines.js';
import * as nearest from './nearest.js';
import * as polygons from './polygons.js';
import * as radial from './radial.js';
import straightSkeleton from './straightSkeleton.js';

const geometry = {
	...convexHull,
	...lines,
	...nearest,
	...polygons,
	...radial,
	straightSkeleton,
};

export { geometry as default };
