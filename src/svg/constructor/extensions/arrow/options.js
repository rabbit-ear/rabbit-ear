/* svg (c) Kraft, MIT License */
const endOptions = () => ({
	visible: false,
	width: 8,
	height: 10,
	padding: 0.0,
});
const makeArrowOptions = () => ({
	head: endOptions(),
	tail: endOptions(),
	bend: 0.0,
	padding: 0.0,
	pinch: 0.618,
	points: [],
});

export { makeArrowOptions };
