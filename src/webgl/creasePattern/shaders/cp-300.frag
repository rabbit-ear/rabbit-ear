#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

in vec3 blend_color;
out vec4 outColor;

void main() {
	outColor = vec4(blend_color.rgb, 1);
}
