#version 100
precision mediump float;

uniform float u_opacity;
varying vec3 front_color;
varying vec3 back_color;

void main () {
	vec3 color = gl_FrontFacing ? front_color : back_color;
	gl_FragColor = vec4(color, u_opacity);
}
