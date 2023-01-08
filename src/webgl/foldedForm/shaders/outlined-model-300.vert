#version 300 es

// uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;

in vec3 v_position;
in vec3 v_normal;
in vec3 v_barycentric;
in float v_rawEdge;
// in uint8_t 
out vec3 front_color;
out vec3 back_color;
out vec3 barycentric;
// flat out int rawEdge;
flat out int provokedVertex;

void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	provokedVertex = gl_VertexID;
	barycentric = v_barycentric;
	// rawEdge = int(v_rawEdge);

	vec3 normal_color = vec3(
		dot(v_normal, normalize(u_modelView * vec4(1, 0, 0, 0)).xyz),
		dot(v_normal, normalize(u_modelView * vec4(0, 1, 0, 0)).xyz),
		dot(v_normal, normalize(u_modelView * vec4(0, 0, 1, 0)).xyz)
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
