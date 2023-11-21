#version 100

attribute vec3 v_position;
attribute vec3 v_normal;
attribute vec3 v_barycentric;

uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
uniform vec3 u_outlineColor;
varying vec3 normal_color;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;
varying vec3 outline_color;

void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	barycentric = v_barycentric;
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
	outline_color = u_outlineColor;
}
