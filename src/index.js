import * as math from '../lib/geometry';
import * as svg from '../lib/svg';
import * as noise from '../lib/perlin';
// import * as Model from './Model';

export { default as CreasePattern } from './CreasePattern';
export { default as Origami } from './View';
export { default as Origami3D } from './View3D';
// export { default as Model } from '/Model';
export { math };
export { svg };
export { noise };
// export { Model };

// fold file manipulators
import * as file from './fold/file';
import * as graph from './fold/graph';
import * as origami from './fold/origami';
import * as planargraph from './fold/planargraph';
import * as valleyfold from './fold/valleyfold';
import * as creasethrough from './fold/creasethrough';
const fold = {
	file: file,
	graph: graph,
	origami: origami,
	planargraph: planargraph,
	valleyfold: valleyfold,
	creasethrough: creasethrough
};
export { fold };

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
