#version 100

attribute vec3 v_position;
attribute vec3 v_color;
attribute vec3 edge_vector;
attribute vec2 vertex_vector;

uniform mat4 u_matrix;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform float u_strokeWidth;
varying vec3 blend_color;

void main () {
	vec3 edge_norm = normalize(edge_vector);
	// axis most dissimilar to edge_vector
	vec3 absNorm = abs(edge_norm);
	vec3 xory = absNorm.x < absNorm.y ? vec3(1,0,0) : vec3(0,1,0);
	vec3 axis = absNorm.x > absNorm.z && absNorm.y > absNorm.z ? vec3(0,0,1) : xory;
	// two perpendiculars. with edge_vector these make basis vectors
	vec3 one = cross(axis, edge_norm);
	vec3 two = cross(one, edge_norm);
	vec3 displaceNormal = normalize(
		one * vertex_vector.x + two * vertex_vector.y
	);
	vec3 displace = displaceNormal * (u_strokeWidth * 0.5);
	gl_Position = u_matrix * vec4(v_position + displace, 1);
	blend_color = v_color;
}
