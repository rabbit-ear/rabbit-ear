/* svg (c) Kraft, MIT License */
import classes_nodes from './classes_nodes.js';

/**
 * SVG (c) Kraft
 */

const nodeNames = Object.values(classes_nodes).flat();

const placeholder = {
	"svg": undefined,
	"defs": undefined,

	// anywhere, usually top level SVG, or <defs>
	"desc": undefined,
	"filter": undefined,
	"metadata": undefined,
	"style": undefined,
	"script": undefined,
	"title": undefined,
	"view": undefined,
	"cdata": undefined,
	"g": undefined,
	"circle": undefined,
	"ellipse": undefined,
	"line": undefined,
	"path": undefined,
	"polygon": undefined,
	"polyline": undefined,
	"rect": undefined,

	// extensions to the SVG spec
	"arc": undefined,
	"arrow": undefined,
	"curve": undefined,
	"parabola": undefined,
	"roundRect": undefined,
	"wedge": undefined,
	"origami": undefined,
	"text": undefined,
	// can contain drawings
	// anywhere, usually top level SVG, or <defs>
	"marker": undefined,
	"symbol": undefined,
	"clipPath": undefined,
	"mask": undefined,
	// inside <defs>
	"linearGradient": undefined,
	"radialGradient": undefined,
	"pattern": undefined,
	"textPath": undefined,
	"tspan": undefined,
	"stop": undefined,
	"feBlend": undefined,
	"feColorMatrix": undefined,
	"feComponentTransfer": undefined,
	"feComposite": undefined,
	"feConvolveMatrix": undefined,
	"feDiffuseLighting": undefined,
	"feDisplacementMap": undefined,
	"feDistantLight": undefined,
	"feDropShadow": undefined,
	"feFlood": undefined,
	"feFuncA": undefined,
	"feFuncB": undefined,
	"feFuncG": undefined,
	"feFuncR": undefined,
	"feGaussianBlur": undefined,
	"feImage": undefined,
	"feMerge": undefined,
	"feMergeNode": undefined,
	"feMorphology": undefined,
	"feOffset": undefined,
	"fePointLight": undefined,
	"feSpecularLighting": undefined,
	"feSpotLight": undefined,
	"feTile": undefined,
	"feTurbulence": undefined,
};

export { classes_nodes as default, nodeNames, placeholder };
