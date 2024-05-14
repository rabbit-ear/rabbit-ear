#version 300 es

uniform mat4 u_matrix;
uniform float u_strokeWidth;

in float edge_foldAngle;
in vec2 v_position;
in vec3 v_color;
in vec2 edge_vector;
in vec2 vertex_vector;
out vec3 blend_color;
out float blend_opacity;

void main () {
	float sign = vertex_vector[0];
	float halfWidth = u_strokeWidth * 0.5;
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
	blend_opacity = edge_foldAngle == 0.0 ? 1.0 : abs(edge_foldAngle) / 180.0;
}
