/**
 * Rabbit Ear (c) Kraft
 */

// this method allows you to attach an outside library to this one
// this library RabbitEar will have been bound to "this"
const use = function (library) {
	if (library == null || typeof library.linker !== "function") {
		return;
	}
	library.linker(this);
};

export default use;

