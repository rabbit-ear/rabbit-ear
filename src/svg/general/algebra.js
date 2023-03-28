/* svg (c) Kraft, MIT License */
const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];
const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
const svg_polar_to_cart = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];
const svg_multiplyMatrices2 = (m1, m2) => [
	m1[0] * m2[0] + m1[2] * m2[1],
	m1[1] * m2[0] + m1[3] * m2[1],
	m1[0] * m2[2] + m1[2] * m2[3],
	m1[1] * m2[2] + m1[3] * m2[3],
	m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];

export { svg_add2, svg_distance2, svg_distanceSq2, svg_magnitude2, svg_magnitudeSq2, svg_multiplyMatrices2, svg_polar_to_cart, svg_scale2, svg_sub2 };
