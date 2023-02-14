#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform float u_opacity;

in vec3 front_color;
in vec3 back_color;
in vec3 barycentric;
out vec4 outColor;

float edgeFactor(vec3 barycenter) {
	vec3 d = fwidth(barycenter);
	vec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);
	return min(min(a3.x, a3.y), a3.z);
}

void main () {
	gl_FragDepth = gl_FragCoord.z;
	vec3 color = gl_FrontFacing ? front_color : back_color;
	outColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);
}
