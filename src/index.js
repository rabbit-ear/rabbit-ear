import * as math from '../lib/geometry';
import * as svg from '../lib/svg';
import * as noise from '../lib/perlin';
// import * as Model from './Model';

export { default as CreasePattern } from './cp/CreasePattern';
export { default as Origami } from './View2D';
export { default as Origami3D } from './View3D';
// export { default as Model } from '/Model';
export { math };
export { svg };
export { noise };
// export { Model };

// fold file manipulators
import * as frame from './fold/frame';
import { default as validate } from './fold/validate';
import * as graph from './fold/graph';
import * as origami from './fold/origami';
import * as planargraph from './fold/planargraph';
import { default as valleyfold } from './fold/valleyfold';
import * as creasethrough from './fold/creasethrough';
const fold = {
	frame: frame,
	validate: validate,
	graph: graph,
	origami: origami,
	planargraph: planargraph,
	valleyfold: valleyfold,
	creasethrough: creasethrough
};
export { fold };

export { default as graph } from './graph';

// load bases
import empty from './bases/empty.fold';
import square from './bases/square.fold';
import book from './bases/book.fold';
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
import blintzAnimated from './bases/blintz-animated.fold';
import blintzDistorted from './bases/blintz-distort.fold';
const bases = {
	empty: JSON.parse(empty),
	square: JSON.parse(square),
	book: JSON.parse(book),
	blintz: JSON.parse(blintz),
	kite: JSON.parse(kite),
	fish: JSON.parse(fish),
	bird: JSON.parse(bird),
	frog: JSON.parse(frog),
	// remove these for production
	test: JSON.parse(test),
	dodecagon: JSON.parse(dodecagon),
	boundary: JSON.parse(boundary),
	concave: JSON.parse(concave),
	blintzAnimated: JSON.parse(blintzAnimated),
	blintzDistorted: JSON.parse(blintzDistorted)
};

export { bases };
