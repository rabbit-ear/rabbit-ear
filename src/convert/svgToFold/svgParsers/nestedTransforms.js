/**
 * Rabbit Ear (c) Kraft
 */
import { multiplyMatrices2 } from "../../../math/algebra/matrix2.js";
import transformStringToMatrix from "./transforms.js";
/**
 * this decends a DOM node tree, gathering the matrix transform and storing each node's local matrix
 * as a property on each node: key "matrix" with value one array of 6 numbers (matrix).
 */
const get_transform_as_matrix = function (element) {
	if (typeof element.getAttribute !== "function") {
		return [1, 0, 0, 1, 0, 0];
	}
	const transformAttr = element.getAttribute("transform");
	if (transformAttr != null && transformAttr !== "") {
		return transformStringToMatrix(transformAttr);
	}
	return [1, 0, 0, 1, 0, 0];
};

const apply_nested_transforms = function (element, stack = [1, 0, 0, 1, 0, 0]) {
	const local = multiplyMatrices2(stack, get_transform_as_matrix(element));
	element.matrix = local;
	// the container objects in SVG: group, the svg itself
	if (element.tagName === "g" || element.tagName === "svg") {
		if (element.childNodes == null) { return; }
		Array.from(element.childNodes)
			.forEach(child => apply_nested_transforms(child, local));
	}
};

export default apply_nested_transforms;
