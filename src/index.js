
// import './graph.js';
// import './planarGraph.js';
import './compiled/src/geometry.js';
import {VoronoiGraph, creaseVoronoi} from './compiled/src/voronoi.js';
import './compiled/src/polynomial.js';
import './compiled/lib/rbush.min.js';

import CreasePattern from './compiled/src/CreasePattern.js';

import SimpleSVG from './SimpleSVG.js';

import OrigamiPaper from './OrigamiPaper.js';
import OrigamiFold from './OrigamiFold.js';


// for convenience, bind these 3 to the window
window.CreasePattern = CreasePattern;
window.OrigamiPaper = OrigamiPaper;
window.OrigamiFold = OrigamiFold;


// export { CreasePattern, OrigamiPaper, OrigamiFold }
export { CreasePattern, OrigamiPaper, OrigamiFold, VoronoiGraph, creaseVoronoi }
