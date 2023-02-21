export const simple_2d_100_vert = `#version 100
uniform mat4 u_matrix;
attribute vec2 v_position;
attribute vec3 v_color;
varying vec3 blend_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = v_color;
}
`;

export const thick_edges_300_vert = `#version 300 es
uniform mat4 u_matrix;
uniform float u_strokeWidth;
in vec2 v_position;
in vec3 v_color;
in vec2 edge_vector;
in vec2 vertex_vector;
out vec3 blend_color;
void main () {
	float sign = vertex_vector[0];
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * u_strokeWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
}
`;

export const simple_2d_300_vert = `#version 300 es
uniform mat4 u_matrix;
in vec2 v_position;
in vec3 v_color;
out vec3 blend_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = v_color;
}
`;

export const thick_edges_100_vert = `#version 100
uniform mat4 u_matrix;
uniform float u_strokeWidth;
attribute vec2 v_position;
attribute vec3 v_color;
attribute vec2 edge_vector;
attribute vec2 vertex_vector;
varying vec3 blend_color;
void main () {
	float sign = vertex_vector[0];
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * u_strokeWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
}
`;

export const simple_2d_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
in vec3 blend_color;
out vec4 outColor;
void main() {
	outColor = vec4(blend_color.rgb, 1);
}
`;

export const simple_2d_100_frag = `#version 100
precision mediump float;
varying vec3 blend_color;
void main () {
	gl_FragColor = vec4(blend_color.rgb, 1);
}
`;
