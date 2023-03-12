/* svg (c) Kraft, MIT License */
const makeUUID = () => Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, "")
	.concat("aaaaa")
	.substr(0, 5);

export { makeUUID as default };
