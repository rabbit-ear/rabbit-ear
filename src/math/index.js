/* Math (c) Kraft, MIT License */
import general from './general/index.js';
import algebra from './algebra/index.js';
import geometry from './geometry/index.js';
import intersect from './intersect/index.js';

const math = {
	...general,
	...algebra,
	...geometry,
	...intersect,
};

export { math as default };
