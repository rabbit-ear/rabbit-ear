#version 100

uniform mat4 u_matrix;
uniform vec3 u_cpColor;

attribute vec2 v_position;
varying vec3 blend_color;

void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = u_cpColor;
}
