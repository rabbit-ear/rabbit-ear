#version 100

uniform mat4 u_matrix;
uniform float u_strokeWidth;

attribute float edge_foldAngle;
attribute vec2 v_position;
attribute vec3 v_color;
attribute vec2 edge_vector;
attribute vec2 vertex_vector;
varying vec3 blend_color;
varying float blend_opacity;

void main () {
	float sign = vertex_vector[0];
	float halfWidth = u_strokeWidth * 0.5;
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
	blend_opacity = edge_foldAngle == 0.0 ? 1.0 : abs(edge_foldAngle) / 180.0;
}
