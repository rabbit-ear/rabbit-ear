/* svg (c) Kraft, MIT License */
import SVGWindow from '../../../environment/window.js';
import makeUUID from '../../../methods/makeUUID.js';

const Animation = function (element) {
	let start;
	const handlers = {};
	let frame = 0;
	let requestId;
	const removeHandlers = () => {
		if (SVGWindow().cancelAnimationFrame) {
			SVGWindow().cancelAnimationFrame(requestId);
		}
		Object.keys(handlers)
			.forEach(uuid => delete handlers[uuid]);
		start = undefined;
		frame = 0;
	};
	Object.defineProperty(element, "play", {
		set: (handler) => {
			removeHandlers();
			if (handler == null) { return; }
			const uuid = makeUUID();
			const handlerFunc = (e) => {
				if (!start) {
					start = e;
					frame = 0;
				}
				const progress = (e - start) * 0.001;
				handler({ time: progress, frame });
				frame += 1;
				if (handlers[uuid]) {
					requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
				}
			};
			handlers[uuid] = handlerFunc;
			if (SVGWindow().requestAnimationFrame) {
				requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
			}
		},
		enumerable: true,
	});
	Object.defineProperty(element, "stop", { value: removeHandlers, enumerable: true });
};

export { Animation as default };
