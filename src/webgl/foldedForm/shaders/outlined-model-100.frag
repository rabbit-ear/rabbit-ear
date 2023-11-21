#version 100
precision mediump float;

uniform float u_opacity;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;
varying vec3 outline_color;

void main () {
	vec3 color = gl_FrontFacing ? front_color : back_color;
	// vec3 boundary = vec3(0.0, 0.0, 0.0);
	vec3 boundary = outline_color;
	// gl_FragDepth = 0.5;
	gl_FragColor = any(lessThan(barycentric, vec3(0.02)))
		? vec4(boundary, u_opacity)
		: vec4(color, u_opacity);
}
