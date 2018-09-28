
// import './graph.js';
// import './planarGraph.js';
// import './geometry.js';

import * as Geometry from './geometry.js'

import {VoronoiGraph, creaseVoronoi} from './voronoi.js';
import './polynomial.js';

import CreasePattern from './creasePattern.js';

import {line, circle, polygon, group, addClass, removeClass} from './SimpleSVG.js';

import OrigamiPaper from './OrigamiPaper.js';
import OrigamiFold from './OrigamiFold.js';
import Origami from './Origami.js';

// for convenience, bind these 3 to the window
window.CreasePattern = CreasePattern;
window.OrigamiPaper = OrigamiPaper;
window.OrigamiFold = OrigamiFold;
window.Origami = Origami;

// print this "// Rabbit Ear https://rabbitear.org v0.1.1 Copyright 2018 Robby Kraft";

// export { CreasePattern, OrigamiPaper, OrigamiFold }
export {
	CreasePattern, OrigamiPaper, OrigamiFold, VoronoiGraph, creaseVoronoi,
	line, circle, polygon, group, addClass, removeClass,
	Geometry,
	Origami
}
