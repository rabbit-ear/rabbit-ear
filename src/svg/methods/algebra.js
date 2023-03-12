/* svg (c) Kraft, MIT License */
const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];
const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
const svg_polar_to_cart = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];

export { svg_add2, svg_distance2, svg_distanceSq2, svg_magnitude2, svg_magnitudeSq2, svg_polar_to_cart, svg_scale2, svg_sub2 };
