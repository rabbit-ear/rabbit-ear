/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import GraphProto from "./graph";
import clip from "../graph/clip";
import add_vertices from "../graph/add/add_vertices";
import add_edges from "../graph/add/add_edges";
import fragment from "../graph/fragment";
import populate from "../graph/populate";
import planar_fold from "../graph/planar_fold/index";
/**
 * Crease Pattern - a flat-array, index-based graph with faces, edges, and vertices
 * that exist in 2D space, edges resolved so there are no edge crossings.
 * The naming scheme for keys follows the FOLD format.
 */
const CreasePattern = {};
CreasePattern.prototype = Object.create(GraphProto);
CreasePattern.prototype.constructor = CreasePattern;
/**
 * how many segments will curves be converted into.
 * todo: user should be able to change this
 */
const arcResolution = 96;

const make_edges_array = function (array) {
  array.mountain = (degrees = -180) => {
    array.forEach(i => {
      this.edges_assignment[i] = "M";
      this.edges_foldAngle[i] = degrees;
    });
    return array;
  };
  array.valley = (degrees = 180) => {
    array.forEach(i => {
      this.edges_assignment[i] = "V";
      this.edges_foldAngle[i] = degrees;
    });
    return array;
  };
  array.flat = () => {
    array.forEach(i => {
      this.edges_assignment[i] = "F";
      this.edges_foldAngle[i] = 0;
    });
    return array;
  };
  return array;
};

// ["line", "ray", "segment"].forEach(type => {
//   CreasePattern.prototype[type] = function () {
//     const primitive = math[type](...arguments);
//     if (!primitive) { return; }
//     const segment = clip(this, primitive);
//     if (!segment) { return; }
//     const vertices = add_vertices(this, segment);
//     const edges = add_edges(this, vertices);
//     const map = fragment(this).edges.map;
//     populate(this);
//     return make_edges_array.call(this, edges.map(e => map[e])
//       .reduce((a, b) => a.concat(b), []));
//   };
// });

["line", "ray", "segment"].forEach(type => {
  CreasePattern.prototype[type] = function () {
    const primitive = math[type](...arguments);
    if (!primitive) { return; }
    const segment = clip(this, primitive);
    if (!segment) { return; }
    const edges = planar_fold(this, segment[0], segment[1]);
    return make_edges_array.call(this, edges);
  };
});

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
  CreasePattern.prototype[fName] = function () {
    const primitive = math[fName](...arguments);
    if (!primitive) { return; }
    const segments = primitive.segments(arcResolution)
      .map(segment => math.segment(segment))
      .map(segment => clip(this, segment))
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
    return make_edges_array.call(this, edges.map(e => map[e])
      .reduce((a, b) => a.concat(b), []));
  };
});

export default CreasePattern.prototype;
