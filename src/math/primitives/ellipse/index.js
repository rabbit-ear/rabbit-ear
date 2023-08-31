/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import { resize } from "../../algebra/vector.js";
import { flattenArrays } from "../../general/array.js";

import {
	pathInfo,
	pointOnEllipse,
	ellipticalArcTo,
} from "./path.js";

const getFoci = function (center, rx, ry, spin) {
	const order = rx > ry;
	const lsq = order ? (rx ** 2) - (ry ** 2) : (ry ** 2) - (rx ** 2);
	const l = Math.sqrt(lsq);
	const trigX = order ? Math.cos(spin) : Math.sin(spin);
	const trigY = order ? Math.sin(spin) : Math.cos(spin);
	return [
		Constructors.vector(center[0] + l * trigX, center[1] + l * trigY),
		Constructors.vector(center[0] - l * trigX, center[1] - l * trigY),
	];
};

export default {
	ellipse: {
		A: function () {
			// const arr = Array.from(arguments);
			const numbers = flattenArrays(arguments).filter(a => !Number.isNaN(a));
			const params = resize(5, numbers);
			this.rx = params[0];
			this.ry = params[1];
			this.origin = Constructors.vector(params[2], params[3]);
			this.spin = params[4];
			this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
			// const numbers = arr.filter(param => !isNaN(param));
			// const vectors = getVector_of_vectors(arr);
			// if (numbers.length === 4) {
			//   // this.origin = Constructors.vector(numbers[0], numbers[1]);
			//   // this.rx = numbers[2];
			//   // this.ry = numbers[3];
			// } else if (vectors.length === 2) {
			//   // two foci
			//   // this.radius = distance2(...vectors);
			//   // this.origin = Constructors.vector(...vectors[0]);
			// }
		},

		// todo, ellipse is not ready to have a Z yet. figure out arguments first
		G: {
			x: function () { return this.origin[0]; },
			y: function () { return this.origin[1]; },
			// z: function () { return this.origin[2]; },
		},
		M: {
			// nearestPoint: function () {
			//   return Constructors.vector(nearest_point_on_ellipse(
			//     this.origin,
			//     this.radius,
			//     getVector(arguments)
			//   ));
			// },
			// intersect: function (object) {
			//   return Intersect(this, object);
			// },
			svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
				const info = pathInfo(
					this.origin[0],
					this.origin[1],
					this.rx,
					this.ry,
					this.spin,
					arcStart,
					deltaArc,
				);
				const arc1 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI)
					* 180, info.fa, info.fs, info.x2, info.y2);
				const arc2 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI)
					* 180, info.fa, info.fs, info.x3, info.y3);
				return `M${info.x1} ${info.y1}${arc1}${arc2}`;
			},
			points: function (count = 128) {
				return Array.from(Array(count))
					.map((_, i) => ((2 * Math.PI) / count) * i)
					.map(angle => pointOnEllipse(
						this.origin.x,
						this.origin.y,
						this.rx,
						this.ry,
						this.spin,
						angle,
					));
			},
			polygon: function () {
				return Constructors.polygon(this.points(arguments[0]));
			},
			segments: function () {
				const points = this.points(arguments[0]);
				return points.map((point, i) => {
					const nextI = (i + 1) % points.length;
					return [point, points[nextI]];
				}); // .map(a => Constructors.segment(...a));
			},

		},

		S: {
			// static methods
			// fromPoints: function () {
			//   const points = getVector_of_vectors(arguments);
			//   return Constructors.circle(points, distance2(points[0], points[1]));
			// }
		},
	},
};
