/* svg (c) Kraft, MIT License */
import TransformMethods from '../shared/transforms.js';
import methods$1 from '../shared/urls.js';
import * as dom from '../shared/dom.js';

const methods = {
	...TransformMethods,
	...methods$1,
	...dom,
};

export { methods as default };
