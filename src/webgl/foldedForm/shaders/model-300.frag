#version 300 es
precision highp float;

uniform float u_opacity;
in vec3 front_color;
in vec3 back_color;
out vec4 outColor;

void main () {
	gl_FragDepth = gl_FragCoord.z;
	vec3 color = gl_FrontFacing ? front_color : back_color;
	outColor = vec4(color, u_opacity);
}
