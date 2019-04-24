import * as math from '../include/geometry';
import * as svg from '../include/svg';
import * as noise from '../include/perlin';

// fold file manipulators
import * as frame from './fold/frame';
import { default as validate } from './fold/validate';
import * as graph from './fold/graph';
import * as origami from './fold/origami';
import * as planargraph from './fold/planargraph';
import { default as valleyfold } from './fold/valleyfold';
import * as creasethrough from './fold/creasethrough';

import { recursive_freeze, intoFOLD, intoSVG, intoORIPA } from './convert/file';

let convert = { intoFOLD, intoSVG, intoORIPA };

const core = Object.create(null);
Object.assign(core, frame, validate, graph, origami, planargraph);
// const fold = {
// 	frame: frame,
// 	validate: validate,
// 	graph: graph,
// 	origami: origami,
// 	planargraph: planargraph,
// 	valleyfold: valleyfold,
// 	creasethrough: creasethrough
// };

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
// import test from './bases/test-three-fold.fold';
// import dodecagon from './bases/test-dodecagon.fold';
// import boundary from './bases/test-boundary.fold';
// import concave from './bases/test-concave.fold';
// import blintzAnimated from './bases/blintz-animated.fold';
// import blintzDistorted from './bases/blintz-distort.fold';
const bases = {
	empty: recursive_freeze(JSON.parse(empty)),
	square: recursive_freeze(JSON.parse(square)),
	book: recursive_freeze(JSON.parse(book)),
	blintz: recursive_freeze(JSON.parse(blintz)),
	kite: recursive_freeze(JSON.parse(kite)),
	fish: recursive_freeze(JSON.parse(fish)),
	bird: recursive_freeze(JSON.parse(bird)),
	frog: recursive_freeze(JSON.parse(frog)),
	// remove these for production
	// test: JSON.parse(test),
	// dodecagon: JSON.parse(dodecagon),
	// boundary: JSON.parse(boundary),
	// concave: JSON.parse(concave),
	// blintzAnimated: JSON.parse(blintzAnimated),
	// blintzDistorted: JSON.parse(blintzDistorted)
};

export { default as CreasePattern } from './cp/CreasePattern';
export { default as Origami } from './View2D';
export { default as Origami3D } from './View3D';
export { default as Graph } from './Graph';

export { math };
export { svg };
export { convert };
export { core };
export { bases };
