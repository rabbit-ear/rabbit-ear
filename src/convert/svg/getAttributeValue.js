/**
 * @description Given one or many parsed stylesheets, hunt for a match based
 * on nodeName selector, id selector, or class selector, and return the value
 * for one attribute if it exists. So for example, you need "stroke" and this
 * will search for a "stroke" property defined on line, .className, or #id.
 */
const getStylesheetStyle = (key, nodeName, attributes, sheets = []) => {
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
	// look for a matching id in the style sheets
	if (id) {
		for (let s = 0; s < sheets.length; s += 1) {
			if (sheets[s][id] && sheets[s][id][key]) {
				return sheets[s][id][key];
			}
		}
	}
	// look for a matching class in the style sheets
	for (let s = 0; s < sheets.length; s += 1) {
		for (let c = 0; c < classes.length; c += 1) {
			if (sheets[s][classes[c]] && sheets[s][classes[c]][key]) {
				return sheets[s][classes[c]][key];
			}
		}
		if (sheets[s][nodeName] && sheets[s][nodeName][key]) {
			return sheets[s][nodeName][key];
		}
	}
	return undefined;
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
const getAttributeValue = (key, nodeName, attributes, sheets = []) => {
	// 1. check inline style
	const inlineStyle = attributes.style
		? attributes.style.match(new RegExp(`${key}[\\s]*:[^;]*;`))
		: null;
	if (inlineStyle) {
		return inlineStyle[0].split(":")[1].replace(";", "");
	}
	// 2. check stylesheet
	const sheetResult = getStylesheetStyle(key, nodeName, attributes, sheets);
	if (sheetResult !== undefined) { return sheetResult; }
	// todo
	// 3. check inline attribute
	if (attributes[key]) { return attributes[key]; }
	return null;
};

export default getAttributeValue;
