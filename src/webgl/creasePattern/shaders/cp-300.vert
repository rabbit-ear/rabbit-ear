#version 300 es

uniform mat4 u_matrix;
uniform vec3 u_cpColor;

in vec2 v_position;
out vec3 blend_color;

void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = u_cpColor;
}
