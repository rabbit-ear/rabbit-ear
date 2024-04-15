export { Constructor as default };
/**
 * @description This is the main constructor for the library which generates
 * SVGElements (DOM elements) using createElementNS in the svg namespace.
 * Additionally, this element will be bound with methods to operate on the
 * element itself, which do things like set an attribute value or
 * create a child of this object.
 * Using this constructor, this library has full support for all elements
 * in the SVG spec (I think so, double check me on this), additionally,
 * some custom elements, for example "arrow" which makes a few shapes under
 * a single <g> group. So this library is highly extendable, you can write
 * your own "arrow" objects, see more inside this directory's subdirectories.
 * @param {string} name the name of the element, although, slightly abstracted
 * from the actual element name, like "line" for <line> because it supports
 * custom elements, "arrow", which in turn will create a <g> or <path> etc..
 * @param {object} parent the parent to append this new node as a child to.
 */
declare function Constructor(name: string, parent: object, ...initArgs: any[]): any;
