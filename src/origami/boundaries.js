import math from "../../include/math";
import { get_boundary } from "../core/boundary";

/**
 * todo: this needs to be setup to handle non-convex polygons
 * for now we're going to wrap this result in an array
 */
const boundary_clips = function (b, i) {
  const graph = this;
  Object.defineProperty(b, "clipLine", {
    value: (...args) => [math.core.intersection.convex_poly_line(
          b.vertices.map(v => graph.vertices_coords[v]),
          math.core.get_line(...args).origin,
          math.core.get_line(...args).vector)]});
  Object.defineProperty(b, "clipRay", {
    value: (...args) => [math.core.intersection.convex_poly_ray(
          b.vertices.map(v => graph.vertices_coords[v]),
          math.core.get_line(...args).origin,
          math.core.get_line(...args).vector)]});
  Object.defineProperty(b, "clipSegment", {
    value: (...args) => [math.core.intersection.convex_poly_segment(
          b.vertices.map(v => graph.vertices_coords[v]),
          ...math.core.get_vector_of_vectors(...args))]});
};

const boundary_coords = function (b, i) {
  const graph = this;
  Object.defineProperty(b, "coords", {
    get: () => {
      if (!b.vertices || !graph.vertices_coords) { return undefined; }
      return b.vertices.map(v => graph.vertices_coords[v]);
    }
  });
};

const setup_boundary = function (b, i) {
  boundary_coords.call(this, b, i);
  boundary_clips.call(this, b, i);
};

const getBoundaries = function () {
  // todo: make this work for multiple boundaries;
  const boundaries = [get_boundary(this)];
  boundaries.forEach(setup_boundary.bind(this));
  return boundaries;
};

export default getBoundaries;
