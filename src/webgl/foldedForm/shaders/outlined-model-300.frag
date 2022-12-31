#version 300 es
// precision mediump float;
precision highp float;

uniform float u_opacity;

uniform vec2 u_touch;
uniform vec2 u_resolution;

// in int gl_PrimitiveID;
// in highp vec4 gl_FragCoord;
// in mediump vec2 gl_PointCoord; // 0.0 to 1.0, location on the screen
// in bool gl_FrontFacing;
// out highp float gl_FragDepth;

flat in int provokedVertex;

in vec3 front_color;
in vec3 back_color;
in vec3 barycentric;
// flat in int rawEdge;
out vec4 outColor;

float hue2rgb (float p, float q, float t) {
	while (t < 0.0) t += 1.0;
	while (t > 1.0) t -= 1.0;
	if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
	if (t < 1.0 / 2.0) return q;
	if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
	return p;
}
vec3 hslToRgb (float h, float s, float l) {
	if (s == 0.0) { return vec3(l, l, l); }
	float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
	float p = 2.0 * l - q;
	float r = hue2rgb(p, q, h + 1.0 / 3.0);
	float g = hue2rgb(p, q, h);
	float b = hue2rgb(p, q, h - 1.0 / 3.0);
	return vec3(r, g, b);
}

float edgeFactor(vec3 barycenter) {
	vec3 d = fwidth(barycenter);
	vec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);
	return min(min(a3.x, a3.y), a3.z);
}

void main () {
	gl_FragDepth = gl_FragCoord.z;
	vec3 color = gl_FrontFacing ? front_color : back_color;
	// vec3 color = hslToRgb(float(gl_PrimitiveID) / 57.0, 0.5, 0.8);
	// vec3 color = hslToRgb(float(provokedVertex) * 1.618, 1.0, 0.45);

	// original output
	// outColor = vec4(color, u_opacity);

	// barycentric #1
	// outColor = any(lessThan(barycentric, vec3(0.02)))
	// 	? vec4(0.0, 0.0, 0.0, 1.0)
	// 	: vec4(color, u_opacity);

	// barycentric #2
	outColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);
	// barycentric #2, transparent faces (kindof. bug)
	// outColor = vec4(1.0, 1.0, 1.0, (1.0-edgeFactor(barycentric))*0.95);

	// // barycentric #3 with raw edge
	// bool side2 = bool(rawEdge & 1);
	// bool side0 = bool(rawEdge & 2);
	// bool side1 = bool(rawEdge & 4);
	// if ((barycentric.x < 0.02 && side0)
	// 	|| (barycentric.y < 0.02 && side1)
	// 	|| (barycentric.z < 0.02 && side2)) {
	// 	outColor = vec4(0.0, 0.0, 0.0, 1.0);
	// }
	// else {
	// 	outColor = vec4(color, u_opacity);
	// }

	
	// if (provokedVertex == 8) {
	// 	outColor = vec4(1, 1, 0, 1);
	// }

	// vec2 fragScale = vec2(gl_FragCoord.x / u_resolution.x, gl_FragCoord.y / u_resolution.y);
	// vec2 touchScale = vec2(u_touch.x / u_resolution.x, u_touch.y / u_resolution.y);
	// // fix. invert.
	// touchScale.y = 1.0 - touchScale.y;
	// float dist = distance(touchScale, fragScale);
	// if (dist < 0.1) {
	// 	float t = dist / 0.1;
	// 	outColor.r = outColor.r * t + 1.0 * (1.0 - t);
	// }
}
