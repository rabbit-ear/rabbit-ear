#version 100
precision mediump float;

varying vec3 blend_color;
varying float blend_opacity;

void main () {
	gl_FragColor = vec4(blend_color.rgb, blend_opacity);
}
