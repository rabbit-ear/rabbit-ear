/**
 * Rabbit Ear (c) Kraft
 */
/**
 * link this library to the larger RabbitEar library. this allows
 * Rabbit Ear to be built with or without this extension.
 */
const linker = function (library) {
	// bind fold-to-svg
	library.graph.svg = this;

	const graphProtoMethods = {
		svg: this,
	};
	Object.keys(graphProtoMethods).forEach(key => {
		library.graph.prototype[key] = function () {
			return graphProtoMethods[key](this, ...arguments);
		};
	});
};

export default linker;
