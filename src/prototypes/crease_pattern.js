/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import GraphProto from "./graph";
import { clip_line } from "../graph/clip";
import add_vertices from "../graph/add/add_vertices";
import add_edges from "../graph/add/add_edges";
import fragment from "../graph/fragment";
import populate from "../graph/populate";
/**
 * Crease Pattern - a flat-array, index-based graph with faces, edges, and vertices
 * that exist in 2D space, edges resolved so there are no edge crossings.
 * The naming scheme for keys follows the FOLD format.
 */
const CreasePatternProto = {};
CreasePatternProto.prototype = Object.create(GraphProto);

const arcResolution = 96;

["line", "ray", "segment"].forEach(type => {
  CreasePatternProto.prototype[type] = function () {
    const primitive = math[type](...arguments);
    if (!primitive) { return; }
    const segment = clip_line(this, primitive);
    if (!segment) { return; }
    const vertices = add_vertices(this, segment);
    const edges = add_edges(this, vertices);
    const map = fragment(this).edges.map;
    populate(this);
		return edges.map(e => map[e]);
  };
});

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
  CreasePatternProto.prototype[fName] = function () {
    const primitive = math[fName](...arguments);
    if (!primitive) { return; }
    const segments = primitive.segments(arcResolution)
      .map(segment => math.segment(segment))
      .map(segment => clip_line(this, segment))
      .filter(a => a !== undefined);
    if (!segments) { return; }
		const vertices = [];
		const edges = [];
    segments.forEach(segment => {
      const verts = add_vertices(this, segment);
      vertices.push(...verts);
      edges.push(...add_edges(this, verts));
    });
    const map = fragment(this).edges.map;
    populate(this);
		return edges.map(e => map[e]);
  };
});

export default CreasePatternProto.prototype;
