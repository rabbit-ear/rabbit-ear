/**
 * Rabbit Ear (c) Kraft
 */
import * as color from "./color.js";
import * as drawBoundaries from "./drawBoundaries.js";
import * as drawVertices from "./drawVertices.js";
import * as drawEdges from "./drawEdges.js";
import * as drawFaces from "./drawFaces.js";
import * as parse from "./parse.js";
import * as stylesheet from "./stylesheet.js";

export default {
	...color,
	...drawBoundaries,
	...drawVertices,
	...drawEdges,
	...drawFaces,
	...parse,
	...stylesheet,
};
