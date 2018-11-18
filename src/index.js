import * as bases from './OrigamiBases';
// import * as math from '../lib/geometry';
// import * as Math from '../lib/geometry';
import { Matrix, Vector, Line, Ray, Edge, Circle } from '../lib/geometry';
import * as svg from '../lib/svg';
import * as fold from './Folder';
import * as noise from '../lib/perlin';

let Math = {
	Matrix,
	Vector,
	Line,
	Ray,
	Edge,
	Circle
}

export { default as Origami } from './View';
export { default as Origami3D } from './View3D';
export { bases };
export { Math };
export { svg };
export { fold };
export { noise };
