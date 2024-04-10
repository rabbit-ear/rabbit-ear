/**
 * @description get the "window" object, which should have
 * DOMParser, XMLSerializer, and document.
 */
declare function RabbitEarWindow(): any;
/**
 * @description This method allows the app to run in both a browser
 * environment, as well as some back-end environment like node.js.
 * In the case of a browser, no need to call this.
 * In the case of a back end environment, include some library such
 * as the popular @XMLDom package and pass it in as the argument here.
 */
export function setWindow(newWindow: any): any;
export { RabbitEarWindow as default };
