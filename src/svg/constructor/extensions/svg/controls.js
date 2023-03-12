/* svg (c) Kraft, MIT License */
import { str_function, str_svg } from '../../../environment/strings.js';
import makeCoordinates from '../../../arguments/makeCoordinates.js';
import { svg_distanceSq2 } from '../../../methods/algebra.js';

const removeFromParent = svg => (svg && svg.parentNode
	? svg.parentNode.removeChild(svg)
	: undefined);
const possiblePositionAttributes = [["cx", "cy"], ["x", "y"]];
const controlPoint = function (parent, options = {}) {
	const position = [0, 0];
	const cp = {
		selected: false,
		svg: undefined,
		updatePosition: input => input,
	};
	const updateSVG = () => {
		if (!cp.svg) { return; }
		if (!cp.svg.parentNode) {
			parent.appendChild(cp.svg);
		}
		possiblePositionAttributes
			.filter(coords => cp.svg[coords[0]] != null)
			.forEach(coords => coords.forEach((attr, i) => {
				cp.svg.setAttribute(attr, position[i]);
			}));
	};
	const proxy = new Proxy(position, {
		set: (target, property, value) => {
			target[property] = value;
			updateSVG();
			return true;
		},
	});
	const setPosition = function (...args) {
		makeCoordinates(...args.flat())
			.forEach((n, i) => { position[i] = n; });
		updateSVG();
		if (typeof position.delegate === str_function) {
			position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
		}
	};
	position.delegate = undefined;
	position.setPosition = setPosition;
	position.onMouseMove = mouse => (cp.selected
		? setPosition(cp.updatePosition(mouse))
		: undefined);
	position.onMouseUp = () => { cp.selected = false; };
	position.distance = mouse => Math.sqrt(svg_distanceSq2(mouse, position));
	["x", "y"].forEach((prop, i) => Object.defineProperty(position, prop, {
		get: () => position[i],
		set: (v) => { position[i] = v; }
	}));
	[str_svg, "updatePosition", "selected"].forEach(key => Object
		.defineProperty(position, key, {
			get: () => cp[key],
			set: (v) => { cp[key] = v; },
		}));
	Object.defineProperty(position, "remove", {
		value: () => {
			removeFromParent(cp.svg);
			position.delegate = undefined;
		},
	});
	return proxy;
};
const controls = function (svg, number, options) {
	let selected;
	let delegate;
	const points = Array.from(Array(number))
		.map(() => controlPoint(svg, options));
	const protocol = point => (typeof delegate === str_function
		? delegate.call(points, point, selected, points)
		: undefined);
	points.forEach((p) => {
		p.delegate = protocol;
		p.pointsContainer = points;
	});
	const mousePressedHandler = function (mouse) {
		if (!(points.length > 0)) { return; }
		selected = points
			.map((p, i) => ({ i, d: svg_distanceSq2(p, [mouse.x, mouse.y]) }))
			.sort((a, b) => a.d - b.d)
			.shift()
			.i;
		points[selected].selected = true;
	};
	const mouseMovedHandler = function (mouse) {
		points.forEach(p => p.onMouseMove(mouse));
	};
	const mouseReleasedHandler = function () {
		points.forEach(p => p.onMouseUp());
		selected = undefined;
	};
	svg.onPress = mousePressedHandler;
	svg.onMove = mouseMovedHandler;
	svg.onRelease = mouseReleasedHandler;
	Object.defineProperty(points, "selectedIndex", { get: () => selected });
	Object.defineProperty(points, "selected", { get: () => points[selected] });
	Object.defineProperty(points, "add", {
		value: (opt) => {
			points.push(controlPoint(svg, opt));
		},
	});
	points.removeAll = () => {
		while (points.length > 0) {
			points.pop().remove();
		}
	};
	const functionalMethods = {
		onChange: (func, runOnceAtStart) => {
			delegate = func;
			if (runOnceAtStart === true) {
				const index = points.length - 1;
				func.call(points, points[index], index, points);
			}
		},
		position: func => points.forEach((p, i) => p.setPosition(func.call(points, p, i, points))),
		svg: func => points.forEach((p, i) => { p.svg = func.call(points, p, i, points); }),
	};
	Object.keys(functionalMethods).forEach((key) => {
		points[key] = function () {
			if (typeof arguments[0] === str_function) {
				functionalMethods[key](...arguments);
			}
			return points;
		};
	});
	points.parent = function (parent) {
		if (parent != null && parent.appendChild != null) {
			points.forEach((p) => { parent.appendChild(p.svg); });
		}
		return points;
	};
	return points;
};
const applyControlsToSVG = (svg) => {
	svg.controls = (...args) => controls.call(svg, svg, ...args);
};

export { applyControlsToSVG as default };
