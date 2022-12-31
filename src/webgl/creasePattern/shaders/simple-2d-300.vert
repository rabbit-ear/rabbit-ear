#version 300 es

uniform mat4 u_matrix;

in vec2 v_position;
in vec3 v_color;
out vec3 blend_color;
// flat out vec3 blend_color;

void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = v_color;
}
