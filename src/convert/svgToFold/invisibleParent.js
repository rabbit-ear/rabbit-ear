import window from "../../environment/window.js";
// import svgNS from "../../svg/spec/namespace.js";

const invisibleParent = (child) => {
	if (!window().document.body) { return undefined; }
	// create an invisible SVG element, add the edges, then getComputedStyle
	// const parent = window().document.createElementNS(svgNS, "svg");
	const parent = window().document.createElement("div");

	// visibility:hidden causes the DOM window layout to resize
	parent.setAttribute("display", "none");
	// parent.setAttribute("visibility", "hidden");

	window().document.body.appendChild(parent);

	parent.appendChild(child);
	return parent;
};

export default invisibleParent;
