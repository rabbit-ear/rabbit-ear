import window from "../../environment/window.js";
import svgNS from "../../svg/spec/namespace.js";

const invisibleParent = (child) => {
	// create an invisible SVG element, add the edges, then getComputedStyle
	const invisible = window().document.createElementNS(svgNS, "svg");

	// visibility:hidden causes the DOM window layout to resize
	invisible.setAttribute("display", "none");
	// invisible.setAttribute("visibility", "hidden");

	// if (window().document.body) {
	// 	window().document.body = window().document.createElement("body");
	// }
	if (window().document.body) {
		window().document.body.appendChild(invisible);
	}
	invisible.appendChild(child);
	return invisible;
};

export default invisibleParent;
