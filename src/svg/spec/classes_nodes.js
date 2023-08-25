/* svg (c) Kraft, MIT License */
/**
 * SVG (c) Kraft
 */
const classes_nodes = {
	svg: [
		"svg",
	],
	defs: [
		"defs", // can only be inside svg
	],
	// anywhere, usually top level SVG, or <defs>
	header: [
		"desc",
		"filter",
		"metadata",
		"style",
		"script",
		"title",
		"view",
	],
	cdata: [
		"cdata",
	],
	group: [
		"g",
	],
	visible: [
		"circle",
		"ellipse",
		"line",
		"path",
		"polygon",
		"polyline",
		"rect",

		// extensions to the SVG spec
		"arc",
		"arrow",
		"curve",
		"parabola",
		"roundRect",
		"wedge",
		"origami",
	],
	text: [
		"text",
	],
	// can contain drawings
	// anywhere, usually top level SVG, or <defs>
	invisible: [
		"marker",
		"symbol",
		"clipPath",
		"mask",
	],
	// inside <defs>
	patterns: [
		"linearGradient",
		"radialGradient",
		"pattern",
	],
	childrenOfText: [
		"textPath",
		"tspan",
	],
	gradients: [ // children of gradients (<linearGradient> <radialGrandient>)
		"stop",
	],
	filter: [ // children of filter
		"feBlend",
		"feColorMatrix",
		"feComponentTransfer",
		"feComposite",
		"feConvolveMatrix",
		"feDiffuseLighting",
		"feDisplacementMap",
		"feDistantLight",
		"feDropShadow",
		"feFlood",
		"feFuncA",
		"feFuncB",
		"feFuncG",
		"feFuncR",
		"feGaussianBlur",
		"feImage",
		"feMerge",
		"feMergeNode",
		"feMorphology",
		"feOffset",
		"fePointLight",
		"feSpecularLighting",
		"feSpotLight",
		"feTile",
		"feTurbulence",
	],
};

export { classes_nodes as default };
