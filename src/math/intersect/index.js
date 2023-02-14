/* Math (c) Kraft, MIT License */
import * as encloses from './encloses.js';
import clipLineConvexPolygon from './clipLinePolygon.js';
import clipPolygonPolygon from './clipPolygonPolygon.js';
import intersectConvexPolygonLine from './intersectPolygonLine.js';
import intersectCircleCircle from './intersectCircleCircle.js';
import intersectCircleLine from './intersectCircleLine.js';
import intersectLineLine from './intersectLineLine.js';
import overlapConvexPolygons from './overlapPolygons.js';
import overlapConvexPolygonPoint from './overlapPolygonPoint.js';
import overlapBoundingBoxes from './overlapBoundingBoxes.js';
import overlapLineLine from './overlapLineLine.js';
import overlapLinePoint from './overlapLinePoint.js';
import splitConvexPolygon from './splitPolygon.js';

const intersect = {
	...encloses,
	clipLineConvexPolygon,
	clipPolygonPolygon,
	intersectConvexPolygonLine,
	intersectCircleCircle,
	intersectCircleLine,
	intersectLineLine,
	overlapConvexPolygons,
	overlapConvexPolygonPoint,
	overlapBoundingBoxes,
	overlapLineLine,
	overlapLinePoint,
	splitConvexPolygon,
};

export { intersect as default };
