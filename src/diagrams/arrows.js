import math from "../math";
import { get_boundary } from "../graph/boundary";
import { clip_line } from "../graph/clip";

// todo: make_arrow_coords is asking for graph to calculate the
// bounding box, to clip the arrow nicely in frame. this should be
// pre-calculated
const best_fit_arrow = (graph, crease) => {
	const boundary = get_boundary(graph).vertices;
	const segment = clip_line(graph, crease);
	const midpoint = math.core.midpoint(...segment);
	const perp = {
		vector: math.core.rotate90(crease.vector),
		origin: crease.origin
	};
	const perp_segment = clip_line(graph, perp);
	return perp_segment;
};

export const one_crease_arrow = (graph, crease, axiom_number, params, result_array_index = 0) => {
	if (axiom_number == null || params == null) {
		return best_fit_arrow(graph, crease);
	}

	return best_fit_arrow(graph, crease);

	switch (axiom_number) {
		case 2: return params && params.points && params.points.length > 1
			? params.points.slice(2)
			: best_fit_arrow(graph, crease);
		case 4:
      crossing = math.core.nearest_point_on_line(
        crease_vector, crease_edge[0], axiom_frame.parameters.lines[0][0], (a => a)
      );
		case 7:
    //	return [axiom_frame.parameters.points[0], axiom_frame.test.points_reflected[0]];
      crossing = math.core.nearest_point_on_line(
        crease_vector, crease_edge[0], axiom_frame.parameters.points[0], (a => a)
      );
		case 5:
    //	return [axiom_frame.parameters.points[1], axiom_frame.test.points_reflected[1]];
		default:
	}
  const perpLine = { point: crossing, vector: arrow_vector };

  const boundary = get_boundary(graph).vertices
    .map(v => graph.vertices_coords[v]);
  const perpClipEdge = math.core.intersection.convex_poly_line(
    boundary, crossing, arrow_vector
  );
  if (perpClipEdge === undefined) {
    // todo: something is causing this to happen. when you flip over the page,
    // far from where it started, then perform folds. when your fold starts
    // and ends outside the bounds of the piece on one side of it.
    return [];
  }
  let short_length = [perpClipEdge[0], perpClipEdge[1]]
    .map(n => math.core.distance2(n, crossing))
    .sort((a, b) => a - b)
    .shift();
  if (axiom === 7) {
    short_length = math.core.distance2(construction.parameters.points[0], crossing);
  }
  const short_vector = arrow_vector.map(v => v * short_length);
  return [
    crossing.map((c, i) => c - short_vector[i]),
    crossing.map((c, i) => c + short_vector[i])
  ];
};

