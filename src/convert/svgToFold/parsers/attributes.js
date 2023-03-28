/**
 * Rabbit Ear (c) Kraft
 */

// SVG is allowed to leave out coordinates with an implied value of 0
export const getAttributesFloatValue = (element, attributes) => attributes
	.map(attr => element.getAttribute(attr))
	.map(str => (str == null ? 0 : str))
	.map(parseFloat);
