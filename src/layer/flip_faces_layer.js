import { invert_map } from "../graph/maps";

const flip_faces_layer = faces_layer => invert_map(
	invert_map(faces_layer).reverse()
);

export default flip_faces_layer;
