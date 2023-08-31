/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import methods from "../shared/polygon.js";
import { boundingBox } from "../../geometry/polygon.js";
import { include, exclude } from "../../general/function.js";
import {
	getRect,
	getArrayOfVectors,
} from "../../general/get.js";

/**
 * this Rectangle type is aligned to the axes for speedy calculation.
 * for a rectangle that can be rotated, use Polygon or ConvexPolygon
 */
const rectToPoints = r => [
	[r.x, r.y],
	[r.x + r.width, r.y],
	[r.x + r.width, r.y + r.height],
	[r.x, r.y + r.height],
];

const rectToSides = r => [
	[[r.x, r.y], [r.x + r.width, r.y]],
	[[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]],
	[[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]],
	[[r.x, r.y + r.height], [r.x, r.y]],
];

export default {
	rect: {
		P: Array.prototype,
		A: function () {
			const r = getRect(...arguments);
			this.width = r.width;
			this.height = r.height;
			this.origin = Constructors.vector(r.x, r.y);
			this.push(...rectToPoints(this));
			Object.defineProperty(this, "domain", { writable: true, value: include });
		},
		G: {
			x: function () { return this.origin[0]; },
			y: function () { return this.origin[1]; },
			center: function () {
				return Constructors.vector(
					this.origin[0] + this.width / 2,
					this.origin[1] + this.height / 2,
				);
			},
		},
		M: Object.assign({}, methods, {
			inclusive: function () { this.domain = include; return this; },
			exclusive: function () { this.domain = exclude; return this; },
			area: function () { return this.width * this.height; },
			segments: function () { return rectToSides(this); },
			svgPath: function () {
				return `M${this.origin.join(" ")}h${this.width}v${this.height}h${-this.width}Z`;
			},
		}),
		S: {
			fromPoints: function () {
				const box = boundingBox(getArrayOfVectors(arguments));
				return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
			},
		},
	},
};
