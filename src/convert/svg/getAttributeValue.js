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
