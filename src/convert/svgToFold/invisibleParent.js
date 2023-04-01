import window from "../../environment/window.js";

const invisibleParent = (child) => {
	if (!window().document.body) { return undefined; }

	// create an invisible element, add the svg, then call getComputedStyle
	const parent = window().document.createElement("div");

	// visibility:hidden causes the DOM window layout to resize
	parent.setAttribute("display", "none");
	// parent.setAttribute("visibility", "hidden");

	window().document.body.appendChild(parent);

	parent.appendChild(child);
	return parent;
};

export default invisibleParent;
