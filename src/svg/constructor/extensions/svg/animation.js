/* svg (c) Kraft, MIT License */
import SVGWindow from '../../../environment/window.js';
import makeUUID from '../../../methods/makeUUID.js';

const Animation = function (element) {
	let start;
	let frame = 0;
	let requestId;
	const handlers = {};
	const stop = () => {
		if (SVGWindow().cancelAnimationFrame) {
			SVGWindow().cancelAnimationFrame(requestId);
		}
		Object.keys(handlers).forEach(uuid => delete handlers[uuid]);
	};
	const play = (handler) => {
		stop();
		if (!handler || !(SVGWindow().requestAnimationFrame)) { return; }
		start = performance.now();
		frame = 0;
		const uuid = makeUUID();
		handlers[uuid] = (now) => {
			const time = (now - start) * 1e-3;
			handler({ time, frame });
			frame += 1;
			if (handlers[uuid]) {
				requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
			}
		};
		requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
	};
	Object.defineProperty(element, "play", { set: play, enumerable: true });
	Object.defineProperty(element, "stop", { value: stop, enumerable: true });
};

export { Animation as default };
