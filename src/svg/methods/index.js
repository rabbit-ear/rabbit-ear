/* svg (c) Kraft, MIT License */
import * as algebra from './algebra.js';
import makeCDATASection from './makeCDATASection.js';
import * as path from './path.js';
import * as viewBox from './viewBox.js';

const methods = {
	...algebra,
	makeCDATASection,
	...path,
	...viewBox,
};

export { methods as default };
