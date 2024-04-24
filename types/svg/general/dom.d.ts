/**
 * @description Add classes to an Element, essentially classList.add(), but
 * it will call a polyfill if classList doesn't exist (as in @xmldom/xmldom)
 * @param {Element} el a DOM element
 * @param {...string} classes a list of class strings to be added to the element
 */
export function addClass(el: Element, ...classes: string[]): void;
/**
 * @description search up the parent-chain until we find the first
 * <Element> with the nodeName matching the parameter,
 * return undefined if none exists.
 * Note: there is no protection against a dependency cycle.
 * @param {Element} element a DOM element
 * @param {string} nodeName the name of the element, like "svg" or "div"
 * @returns {Element|null} the element if it exists
 */
export function findElementTypeInParents(element: Element, nodeName: string): Element | null;
/**
 * @description Recurse through a DOM element and flatten all elements
 * into one array. This ignores all style attributes, including
 * "transform" which by its absense really makes this function useful
 * for treating all elements on an individual bases, and not a reliable
 * reflection of where the element will end up, globally speaking.
 * @param {Element|ChildNode} el an element
 * @returns {(Element|ChildNode)[]} a flat list of all elements
 */
export function flattenDomTree(el: Element | ChildNode): (Element | ChildNode)[];
/**
 * @description Recurse through a DOM element and flatten all elements
 * into one array, where each element also has a style object which
 * contains a flat object of all attributes from the parents down
 * to the element itself, the closer to the element gets priority, and
 * the parent attributes will be overwritten, except in the case of
 * "transform", where the parent-child values are computed and merged.
 * @param {Element|ChildNode} element
 * @param {object} attributes key value pairs of attributes
 * @returns {{ element: Element|ChildNode, attributes: { [key: string]: string } }[]}
 * a flat array of objects containing the element and an object describing
 * the attributes.
 */
export function flattenDomTreeWithStyle(element: Element | ChildNode, attributes?: object): {
    element: Element | ChildNode;
    attributes: {
        [key: string]: string;
    };
}[];
/**
 * @description Get the furthest root parent up the DOM tree
 * @param {Element} el an element
 * @returns {Element} the top-most parent in the parent node chain.
 */
export function getRootParent(el: Element): Element;
/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Parse a string into an XML Element
 * @param {string} input an SVG as a string
 * @param {string} mimeType default to XML, for SVG use "image/svg+xml".
 * @returns {Element|null} the document element or null if unsuccessful.
 */
export function xmlStringToElement(input: string, mimeType?: string): Element | null;
//# sourceMappingURL=dom.d.ts.map