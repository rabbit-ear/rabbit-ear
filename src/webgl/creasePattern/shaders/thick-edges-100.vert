#version 100

attribute vec2 v_position;
attribute vec3 v_color;
attribute vec2 edge_vector;
attribute vec2 vertex_vector;

uniform mat4 u_matrix;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform float u_strokeWidth;
varying vec3 blend_color;

void main () {
	// dot(normal, (u_modelView * vec4(1, 0, 0, 0)).xyz),
	// this one works
	float sign = vertex_vector[0];
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * u_strokeWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);

	// vec3 forward = (u_modelView * vec4(0, 0, 1, 0)).xyz;
	// float sign = vertex_vector[0];
	// vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign));
	// vec3 side3d = (u_modelView * vec4(side, 0, 1)).xyz;
	// vec3 c = normalize(cross(side3d, forward)) * u_strokeWidth;
	// // gl_Position = u_matrix * vec4(v_position.x + c.x, v_position.y + c.y, c.z, 1);
	// gl_Position = u_matrix * vec4(v_position, 0, 1) + u_projection * vec4(c, 1);
	
	// vec3 forward = (u_modelView * vec4(0, 0, 1, 0)).xyz;
	// vec3 edgeVec3d = (u_modelView * vec4(edge_vector, 0, 0)).xyz;
	// vec3 thick = normalize(cross(edgeVec3d, forward)) * sign * u_strokeWidth;
	// vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * u_strokeWidth;
	// vec4 projected_vector = u_matrix * vec4(normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)), 0, 1);
	// gl_Position = u_matrix * vec4(v_position, 0, 1) + vec4(thick.xyz, 0);
	// gl_Position = u_matrix * vec4(v_position, 0, 1) + vec4(0, u_strokeWidth * sign, 0, 0);
	blend_color = v_color;
}
