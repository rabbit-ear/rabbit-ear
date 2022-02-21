/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as make from "./make";
import * as boundary from "./boundary";
import * as walk from "./walk";
import * as nearest from "./nearest";
import * as fold_object from "../fold/spec";
import * as sort from "./sort";
import * as span from "./span";
import * as maps from "./maps";
import * as query from "./query";
import count from "./count";
import implied from "./count_implied";
import remove from "./remove";
import replace from "./replace";
import populate from "./populate";
import assign from "./assign";
import transform from "./affine";
import subgraph from "./subgraph";
import explode_faces from "./explode_faces";
import clip from "./clip";
import fragment from "./fragment";
import clean from "./clean";
import validate from "./validate";
import get_vertices_clusters from "./vertices_clusters";
// import create from "./create";
// add things
// import add_vertices_split_edges from "./add/add_vertices_split_edges";
import add_vertices from "./add/add_vertices";
import add_edges from "./add/add_edges";
import split_edge from "./split_edge/index";
import split_face from "./split_face/index";
import flat_fold from "./flat_fold/index";
import add_planar_segment from "./add/add_planar_segment";
import remove_planar_vertex from "./remove/remove_planar_vertex";
import remove_planar_edge from "./remove/remove_planar_edge";
import * as intersect from "./intersect";
import * as overlap from "./overlap";
import * as vertices_violations from "./vertices_violations";
import * as edges_violations from "./edges_violations";
import * as vertices_collinear from "./vertices_collinear";
import * as faces_layer from "./faces_layer";
import * as edges_edges from "./edges_edges";
import * as vertices_coords_folded from "./vertices_coords_folded";
import * as face_spanning_tree from "./face_spanning_tree";
import * as faces_matrix from "./faces_matrix";
import * as faces_winding from "./faces_winding";
// import { join_collinear_edges } from "./join_edges";

// todo: not sure about this organization
import * as arrays from "../general/arrays";
import clone from "../general/clone";

export default Object.assign(Object.create(null), {
	// modifiers
	assign,
	// add things
	add_vertices,
	// add_vertices_split_edges,
	add_edges,
	split_edge,
	split_face,
	flat_fold,
	add_planar_segment,
	remove_planar_vertex,
	remove_planar_edge,
	// validate
	validate,
	get_vertices_clusters,
	//
	// clean,
	count,
	implied,
	fragment,
	remove,
	replace,
	populate,
	subgraph,
	explode_faces,
	clip,
	// various
	// join_collinear_edges,
},
	make,
	overlap,
	intersect,
	edges_edges,
	vertices_coords_folded,
	face_spanning_tree,
	faces_matrix,
	faces_winding,
	faces_layer,
	// tacos,
	// create,
	transform,
	boundary,
	walk,
	nearest,
	fold_object,
	sort,
	span,
	maps,
	query,
	vertices_violations,
	edges_violations,
	vertices_collinear,
	// vertices_isolated,
	arrays,
);

