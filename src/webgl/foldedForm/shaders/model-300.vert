#version 300 es

uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;

in vec3 v_position;
in vec3 v_normal;
out vec3 front_color;
out vec3 back_color;

void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
}
