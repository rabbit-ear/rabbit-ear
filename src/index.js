// import * as bases from './OrigamiBases';
import * as math from '../lib/geometry';
import * as svg from '../lib/svg';
import * as fold from './Folder';
import * as noise from '../lib/perlin';
import * as graph from './Graph';

export { default as Origami } from './View';
export { default as Origami3D } from './View3D';
export { math };
export { svg };
export { fold };
export { noise };
export { graph };

// load bases
import empty from './bases/empty.fold';
import square from './bases/square.fold';
import blintz from './bases/blintz.fold';
import kite from './bases/kite.fold';
import fish from './bases/fish.fold';
import bird from './bases/bird.fold';
import frog from './bases/frog.fold';
// remove these for production
import test from './bases/test-three-fold.fold';
import dodecagon from './bases/test-dodecagon.fold';
import boundary from './bases/test-boundary.fold';
import concave from './bases/test-concave.fold';
const bases = {
	empty: JSON.parse(empty),
	square: JSON.parse(square),
	blintz: JSON.parse(blintz),
	kite: JSON.parse(kite),
	fish: JSON.parse(fish),
	bird: JSON.parse(bird),
	frog: JSON.parse(frog),
	// remove these for production
	test: JSON.parse(test),
	dodecagon: JSON.parse(dodecagon),
	boundary: JSON.parse(boundary),
	concave: JSON.parse(concave)
};

export { bases };
