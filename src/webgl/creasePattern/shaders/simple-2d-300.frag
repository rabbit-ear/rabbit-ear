#version 300 es
precision mediump float;
// precision highp float;

// flat in vec4 blend_color;
in vec3 blend_color;
out vec4 outColor;
 
void main() {
	outColor = vec4(blend_color.rgb, 1);
}
