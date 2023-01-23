const getStylesheetStyle = (key, attributes, sheets = []) => {
	const classes = attributes.class
		? attributes.class
			.split(/\s/)
			.filter(Boolean)
			.map(i => i.trim())
			.map(str => `.${str}`)
		: [];
	const id = attributes.id
		? `#${attributes.id}`
		: null;
};

const parseStyle = (node, styleParam) => {
	const style = { ...styleParam }; // clone style
	let stylesheetStyles = {};
	if (node.hasAttribute("class")) {
		const classSelectors = node.getAttribute("class")
			.split(/\s/)
			.filter(Boolean)
			.map(i => i.trim());
		for (let i = 0; i < classSelectors.length; i += 1) {
			stylesheetStyles = Object.assign(
				stylesheetStyles,
				stylesheets["." + classSelectors[i]],
			);
		}
	}
	if (node.hasAttribute("id")) {
		stylesheetStyles = Object.assign(
			stylesheetStyles,
			stylesheets["#" + node.getAttribute("id")],
		);
	}
	function addStyle(svgName, jsName, adjustFunction) {
		if (adjustFunction === undefined ) adjustFunction = function copy( v ) {
			if (v.startsWith( 'url' ) ) console.warn( 'SVGLoader: url access in attributes is not implemented.' );
			return v;
		};
		if (node.hasAttribute(svgName)) style[jsName] = adjustFunction(node.getAttribute(svgName));
		if (stylesheetStyles[svgName]) style[jsName] = adjustFunction(stylesheetStyles[svgName]);
		if (node.style && node.style[svgName] !== "") style[jsName] = adjustFunction(node.style[svgName]);
	}
	function clamp(v) {
		return Math.max(0, Math.min(1, parseFloatWithUnits(v)));
	}
	function positive(v) {
		return Math.max(0, parseFloatWithUnits(v));
	}
	addStyle("fill", "fill");
	addStyle("fill-opacity", "fillOpacity", clamp);
	addStyle("fill-rule", "fillRule");
	addStyle("opacity", "opacity", clamp);
	addStyle("stroke", "stroke");
	addStyle("stroke-opacity", "strokeOpacity", clamp);
	addStyle("stroke-width", "strokeWidth", positive);
	addStyle("stroke-linejoin", "strokeLineJoin");
	addStyle("stroke-linecap", "strokeLineCap");
	addStyle("stroke-miterlimit", "strokeMiterLimit", positive);
	addStyle("visibility", "visibility");
	return style;
};

/**
 * @description Given a DOM object's attribute list and
 * a CSS stylesheet (if it exists), search for a requested
 * attribute in 3 places: inline style, stylesheet, attribute,
 * in that order, as this is also the rendering order adhered
 * to by major browsers.
 * @param {string} key the requested attribute key.
 * @param {object} attributes the DOM elements attributes
 * converted into an object, eg: { stroke: "black", ... }
 * @param {CSSStylesheet[]} sheets an array of CSS stylesheets
 * @returns {string|null} the value of the attribute.
 */
const getAttributeValue = (key, attributes, sheets = []) => {
	// 1. check inline style
	const inlineStyle = attributes.style
		? attributes.style.match(new RegExp(`${key}[\\s]*:[^;]*;`))
		: null;
	if (inlineStyle) {
		return inlineStyle[0].split(":")[1].replace(";", "");
	}
	// 2. check stylesheet
	// todo
	// 3. check inline attribute
	if (attributes[key]) { return attributes[key]; }
	return null;
};

export default getAttributeValue;
