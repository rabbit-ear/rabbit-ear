/* svg (c) Kraft, MIT License */
import { capitalized } from '../../../general/transformCase.js';
import { convertToViewBox } from '../../../general/viewBox.js';

const eventNameCategories = {
	move: ["mousemove", "touchmove"],
	press: ["mousedown", "touchstart"],
	release: ["mouseup", "touchend"],
	leave: ["mouseleave", "touchcancel"],
};
const off = (el, handlers) => Object.values(eventNameCategories)
	.flat()
	.forEach((handlerName) => {
		handlers[handlerName].forEach(func => el
			.removeEventListener(handlerName, func));
		handlers[handlerName] = [];
	});
const defineGetter = (obj, prop, value) => Object
	.defineProperty(obj, prop, {
		get: () => value,
		enumerable: true,
		configurable: true,
	});
const TouchEvents = function (element) {
	const handlers = [];
	Object.keys(eventNameCategories).forEach((key) => {
		eventNameCategories[key].forEach((handler) => {
			handlers[handler] = [];
		});
	});
	const removeHandler = category => eventNameCategories[category]
		.forEach(handlerName => handlers[handlerName]
			.forEach(func => element.removeEventListener(handlerName, func)));
	Object.keys(eventNameCategories).forEach((category) => {
		Object.defineProperty(element, `on${capitalized(category)}`, {
			set: (handler) => {
				if (!element.addEventListener) { return; }
				if (handler == null) {
					removeHandler(category);
					return;
				}
				eventNameCategories[category].forEach((handlerName) => {
					const handlerFunc = (e) => {
						const pointer = (e.touches != null ? e.touches[0] : e);
						if (pointer !== undefined) {
							const { clientX, clientY } = pointer;
							const [x, y] = convertToViewBox(element, clientX, clientY);
							defineGetter(e, "x", x);
							defineGetter(e, "y", y);
						}
						handler(e);
					};
					handlers[handlerName].push(handlerFunc);
					element.addEventListener(handlerName, handlerFunc);
				});
			},
			enumerable: true,
		});
	});
	Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};

export { TouchEvents as default };
