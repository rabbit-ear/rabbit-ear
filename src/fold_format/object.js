export const clone = function(o) {
	// from https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
	var newO, i;
	if (typeof o !== 'object') {
		return o;
	}
	if (!o) {
		return o;
	}
	if ('[object Array]' === Object.prototype.toString.apply(o)) {
		newO = [];
		for (i = 0; i < o.length; i += 1) {
			newO[i] = clone(o[i]);
		}
		return newO;
	}
	newO = {};
	for (i in o) {
		if (o.hasOwnProperty(i)) {
			newO[i] = clone(o[i]);
		}
	}
	return newO;
} 

export const recursive_freeze = function(input) {
	Object.freeze(input);
		if (input === undefined) {
		return input;
	}
	Object.getOwnPropertyNames(input).filter(prop =>
		input[prop] !== null
		&& (typeof input[prop] === "object" || typeof input[prop] === "function")
		&& !Object.isFrozen(input[prop])
	).forEach(prop => recursive_freeze(input[prop]));
	return input;
}
