#version 100
precision mediump float;

varying vec3 blend_color;

void main () {
	gl_FragColor = vec4(blend_color.rgb, 1);
}
