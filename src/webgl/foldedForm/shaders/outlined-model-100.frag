#version 100

precision mediump float;
uniform float u_opacity;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;

// float edgeFactor(vec3 barycenter) {
// 	vec3 d = fwidth(barycenter);
// 	vec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);
// 	return min(min(a3.x, a3.y), a3.z);
// }

void main () {
	vec3 color = gl_FrontFacing ? front_color : back_color;
	// gl_FragColor = vec4(blend_color.rgb, u_opacity);
	// gl_FragDepth = 0.5;

	// barycentric #1
	gl_FragColor = any(lessThan(barycentric, vec3(0.02)))
		? vec4(0.0, 0.0, 0.0, 1.0)
		: vec4(color, u_opacity);
	// barycentric #2
	// gl_FragColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);
}
