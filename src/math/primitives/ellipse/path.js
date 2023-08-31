/**
 * Math (c) Kraft
 */
import {
	cleanNumber,
} from "../../general/number.js";

export const pointOnEllipse = function (cx, cy, rx, ry, zRotation, arcAngle) {
	const cos_rotate = Math.cos(zRotation);
	const sin_rotate = Math.sin(zRotation);
	const cos_arc = Math.cos(arcAngle);
	const sin_arc = Math.sin(arcAngle);
	return [
		cx + cos_rotate * rx * cos_arc + -sin_rotate * ry * sin_arc,
		cy + sin_rotate * rx * cos_arc + cos_rotate * ry * sin_arc,
	];
};

export const pathInfo = function (cx, cy, rx, ry, zRotation, arcStart_, deltaArc_) {
	let arcStart = arcStart_;
	if (arcStart < 0 && !Number.isNaN(arcStart)) {
		while (arcStart < 0) {
			arcStart += Math.PI * 2;
		}
	}
	const deltaArc = deltaArc_ > Math.PI * 2 ? Math.PI * 2 : deltaArc_;
	const start = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart);
	// we need to divide the circle in half and make 2 arcs
	const middle = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc / 2);
	const end = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc);
	const fa = ((deltaArc / 2) > Math.PI) ? 1 : 0;
	const fs = ((deltaArc / 2) > 0) ? 1 : 0;
	return {
		x1: start[0],
		y1: start[1],
		x2: middle[0],
		y2: middle[1],
		x3: end[0],
		y3: end[1],
		fa,
		fs,
	};
};

const cln = n => cleanNumber(n, 4);

// (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
export const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) => (
	`A${cln(rx)} ${cln(ry)} ${cln(phi_degrees)} ${cln(fa)} ${cln(fs)} ${cln(endX)} ${cln(endY)}`
);
