#version 100

attribute vec3 v_position;
attribute vec3 v_normal;
attribute vec3 v_barycentric;

uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
varying vec3 normal_color;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;

void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	barycentric = v_barycentric;

	normal_color = vec3(
		dot(v_normal, (u_modelView * vec4(1, 0, 0, 0)).xyz),
		dot(v_normal, (u_modelView * vec4(0, 1, 0, 0)).xyz),
		dot(v_normal, (u_modelView * vec4(0, 0, 1, 0)).xyz)
	);
	// normal_color = vec3(
	// 	dot(v_normal, vec4(1, 0, 0, 0).xyz),
	// 	dot(v_normal, vec4(0, 1, 0, 0).xyz),
	// 	dot(v_normal, vec4(0, 0, 1, 0).xyz)
	// );

	float grayX = abs(normal_color.x);
	float grayY = abs(normal_color.y);
	float grayZ = abs(normal_color.z);
	float gray = 0.25 + clamp(grayY, 1.0, 0.25) * 0.5 + grayX * 0.25 + grayZ * 0.25;
	float c = clamp(gray, 0.0, 1.0);
	front_color = u_frontColor * c;
	back_color = u_backColor * c;
}
