/**
 * Math (c) Kraft
 */
import Constructors from "./constructors.js";
import Vector from "./vector/index.js";
import Line from "./lines/line.js";
import Ray from "./lines/ray.js";
import Segment from "./lines/segment.js";
import Circle from "./circle/index.js";
import Ellipse from "./ellipse/index.js";
import Rect from "./rect/index.js";
import Polygon from "./polygon/index.js";
import Polyline from "./polyline/index.js";
import Matrix from "./matrix/matrix.js";
// import Junction from "./junction/index.js";
// import Plane from "./plane/index.js";
// import Matrix2 from "./matrix/matrix2.js";

// import PolygonPrototype from "./prototypes/polygon.js";

// Each primitive is defined by these key/values:
// {
//   P: proto- the prototype of the prototype (default: Object.prototype)
//   G: getters- will become Object.defineProperty(___, ___, { get: })
//   M: methods- will become Object.defineProperty(___, ___, { value: })
//   A: args- parse user-arguments, set properties on "this"
//   S: static- static methods added to the constructor
// }
// keys are one letter to shrink minified compile size

const Definitions = {
	...Vector,
	...Line,
	...Ray,
	...Segment,
	...Circle,
	...Ellipse,
	...Rect,
	...Polygon,
	...Polyline,
	...Matrix,
	// Junction,
	// Plane,
	// Matrix2,
};

const create = function (primitiveName, args) {
	const a = Object.create(Definitions[primitiveName].proto);
	Definitions[primitiveName].A.apply(a, args);
	return a; // Object.freeze(a); // basically no cost. matrix needs to able to be modified now
};

// these have to be typed out longform like this
// this function name is what appears as the object type name in use
/**
 * @memberof ear
 * @description Make a vector primitive from a sequence of numbers.
 * This vector/point object comes with object methods, the object is **immutable**
 * and methods will return modified copies. The object inherits from Array.prototype
 * so that its components can be accessed via array syntax, [0], [1], or .x, .y, .z properties.
 * There is no limit to the dimensions, some methods like cross product are dimension-specific.
 * @param {...number|number[]} numbers a list of numbers as arguments or inside an array
 * @returns {vector} one vector object
 */
const vector = function () { return create("vector", arguments); };
/**
 * @memberof ear
 * @description Make a line defined by a vector and a point passing through the line.
 * This object comes with object methods and can be used in intersection calculations.
 * @param {number[]} vector the line's vector
 * @param {number[]} origin the line's origin (without this, it will assumed to be the origin)
 * @returns {line} one line object
 */
const line = function () { return create("line", arguments); };
/**
 * @memberof ear
 * @description Make a ray defined by a vector and an origin point.
 * This object comes with object methods and can be used in intersection calculations.
 * @param {number[]} vector the ray's vector
 * @param {number[]} origin the ray's origin (without this, it will assumed to be the origin)
 * @returns {ray} one ray object
 */
const ray = function () { return create("ray", arguments); };
/**
 * @memberof ear
 * @description Make a segment defined by two endpoints. This object comes
 * with object methods and can be used in intersection calculations.
 * @param {number[]} a the first point
 * @param {number[]} b the second point
 * @returns {segment} one segment object
 */
const segment = function () { return create("segment", arguments); };
/**
 * @memberof ear
 * @description Make a circle defined by a radius and a center. This comes with
 * object methods and can be used in intersection calculations.
 * @param {number} radius the circle's radius
 * @param {number[]|...number} origin the center of the circle
 * @returns {circle} one circle object
 */
const circle = function () { return create("circle", arguments); };
/**
 * @memberof ear
 * @description Make an ellipse defined by a two radii and a center. This comes with object methods.
 * @param {number} rx the radius along the x axis
 * @param {number} ry the radius along the y axis
 * @param {number[]} origin the center of the ellipse
 * @param {number} spin the angle of rotation in radians
 * @returns {ellipse} one ellipse object
 */
const ellipse = function () { return create("ellipse", arguments); };
/**
 * @memberof ear
 * @description Make an 2D axis-aligned rectangle defined by a corner point
 * and a width and height. This comes with object methods and can
 * be used in intersection calculations.
 * @param {number} x the x coordinate of the origin
 * @param {number} y the y coordinate of the origin
 * @param {number} width the width of the rectangle
 * @param {number} height the height of the rectangle
 * @returns {rect} one rect object
 */
const rect = function () { return create("rect", arguments); };
/**
 * @memberof ear
 * @description Make a polygon defined by a sequence of points. This comes with
 * object methods and can be used in intersection calculations. The polygon can be non-convex,
 * but some methods only work on convex polygons.
 * @param {number[][]|...number[]} points one array containing points (array of numbers)
 * or a list of points as the arguments.
 * @returns {polygon} one polygon object
 */
const polygon = function () { return create("polygon", arguments); };
/**
 * @memberof ear
 * @description Make a polyline defined by a sequence of points.
 * @param {number[][]|...number[]} points one array containing points (array of numbers)
 * or a list of points as the arguments.
 * @returns {polyline} one polyline object
 */
const polyline = function () { return create("polyline", arguments); };
/**
 * @memberof ear
 * @description Make a 3x4 column-major matrix containing three basis
 * vectors and a translation column. This comes with object methods and
 * this is the one primitive in the library which **is mutable**.
 * @param {number[]|...number} numbers one array of 12 numbers, or 12 numbers listed as parameters.
 * @returns {matrix} one 3x4 matrix object
 */
const matrix = function () { return create("matrix", arguments); };
// const junction = function () { return create("junction", arguments); };
// const plane = function () { return create("plane", arguments); };
// const matrix2 = function () { return create("matrix2", arguments); };

/**
 * @typedef vector
 * @type {object}
 * @description a vector/point primitive. there is no limit to the number of dimensions.
 * @property {number[]} 0...n array indices for the individual vector values.
 */

/**
 * @typedef matrix
 * @type {object}
 * @description a 3x4 matrix representing a transformation in 3D space,
 * including a translation component.
 * @property {number[]} 0...11 array indices for the individual matrix values
 */

/**
 * @typedef line
 * @type {object}
 * @description a line primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin a point that passes through the line
 */

/**
 * @typedef ray
 * @type {object}
 * @description a ray primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin the origin of the ray
 */

/**
 * @typedef segment
 * @type {object}
 * @description a segment primitive, defined by two endpoints
 * @property {number[]} 0 array index 0, the location of the first point
 * @property {number[]} 1 array index 1, the location of the second point
 * @property {number[]} vector a vector which represents the direction and length of the segment
 * @property {number[]} origin the first segment point
 */

/**
 * @typedef rect
 * @type {object}
 * @description an axis-aligned rectangle primitive
 * @property {number} width
 * @property {number} height
 * @property {number[]} origin the bottom left corner (or top level for Y-down computer screens)
 */

/**
 * @typedef circle
 * @type {object}
 * @description a circle primitive
 * @property {number} radius
 * @property {number[]} origin
 */

/**
 * @typedef ellipse
 * @type {object}
 * @description a ellipse primitive
 * @property {number} rx radius in the primary axis
 * @property {number} ry radius in the secondary axis
 * @property {number} spin the angle of rotation through the center in radians
 * @property {number[]} origin the center of the ellipse
 * @property {number[][]} foci array of two points, each focus of the ellipse
 */

/**
 * @typedef polygon
 * @type {object}
 * @description a polygon primitive
 * @property {number[][]} points a sequence of points, each point being an array of numbers
 */

/**
 * @typedef polyline
 * @type {object}
 * @description a polyline primitive
 * @property {number[][]} points a sequence of points, each point being an array of numbers
 */

Object.assign(Constructors, {
	vector,
	line,
	ray,
	segment,
	circle,
	ellipse,
	rect,
	polygon,
	polyline,
	matrix,
	// junction,
	// plane,
	// matrix2,
});

// build prototypes
Object.keys(Definitions).forEach(primitiveName => {
	// create the prototype
	const Proto = {};
	Proto.prototype = Definitions[primitiveName].P != null
		? Object.create(Definitions[primitiveName].P)
		: Object.create(Object.prototype);
	Proto.prototype.constructor = Proto;

	// make this present in the prototype chain so "instanceof" works
	Constructors[primitiveName].prototype = Proto.prototype;
	Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];

	// getters
	Object.keys(Definitions[primitiveName].G)
		.forEach(key => Object.defineProperty(Proto.prototype, key, {
			get: Definitions[primitiveName].G[key],
			// enumerable: true
		}));

	// methods
	Object.keys(Definitions[primitiveName].M)
		.forEach(key => Object.defineProperty(Proto.prototype, key, {
			value: Definitions[primitiveName].M[key],
		}));

	// applied to the constructor not the prototype
	Object.keys(Definitions[primitiveName].S)
		.forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
			// bind to the prototype, this.constructor will point to the constructor
			value: Definitions[primitiveName].S[key]
				.bind(Constructors[primitiveName].prototype),
		}));

	// done with prototype
	// Object.freeze(Proto.prototype); // now able to be modified from the outside

	// store the prototype on the Definition, to be called during instantiation
	Definitions[primitiveName].proto = Proto.prototype;
});

// console.log(Definitions);

// add the prototypes as a child of the main exported object
// Constructors.__prototypes__ = Object.create(null);
// Object.keys(Definitions).forEach(primitiveName => {
//   Constructors.__prototypes__[primitiveName] = Definitions[primitiveName].proto;
// });

export default Constructors;
