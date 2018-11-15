import * as bases from './OrigamiBases';
// import * as math from '../lib/geometry';
// import * as Math from '../lib/geometry';
import { Matrix, Vector, Line, Ray, Edge, Circle } from '../lib/geometry';
import * as svg from '../lib/svg';
import * as fold from './Folder';

let Math = {
	Matrix,
	Vector,
	Line,
	Ray,
	Edge,
	Circle
}

export { default as Origami } from './View';
export { bases };
export { Math };
export { svg };
export { fold };
