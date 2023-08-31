/**
 * Math (c) Kraft
 */
import * as constants from "./constant.js";
import * as mathFunctions from "./function.js";
import * as getMethods from "./get.js";
import * as convertMethods from "./convert.js";
import * as arrayMethods from "./array.js";
import * as numberMethods from "./number.js";
import * as searchMethods from "./search.js";
import * as sortMethods from "./sort.js";
import typeOf from "./typeOf.js";

export default {
	...constants,
	...mathFunctions,
	...getMethods,
	...convertMethods,
	...arrayMethods,
	...numberMethods,
	...searchMethods,
	...sortMethods,
	typeof: typeOf,
};
