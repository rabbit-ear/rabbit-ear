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
	// find an axis with which to compute the cross product
	// we want the axis which is most unlike the edge_vector
	float xdot = abs(dot(vec3(1,0,0), edge_norm));
	float ydot = abs(dot(vec3(0,1,0), edge_norm));
	float zdot = abs(dot(vec3(0,0,1), edge_norm));
	vec3 xory = xdot < ydot ? vec3(1,0,0) : vec3(0,1,0);
	vec3 axis = xdot > zdot && ydot > zdot ? vec3(0,0,1) : xory;
	// these are two perpendicular vectors to the edge_vector
	// together all three of them are the basis vectors
	vec3 one = cross(axis, edge_norm);
	vec3 two = cross(one, edge_norm);
	// displace the point along a vector from its original spot
	vec3 displace = normalize(
		one * vertex_vector.x +
		two * vertex_vector.y) * u_strokeWidth;
	// gl_Position = u_matrix * vec4(vec3(side, 0) + v_position, 1);
	gl_Position = u_matrix * vec4(v_position + displace, 1);
	// gl_Position = u_matrix * vec4(v_position, 1);
	blend_color = v_color;
}
