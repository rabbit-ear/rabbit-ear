#version 100
precision mediump float;

varying vec3 blend_color;
varying float blend_opacity;

void main () {
	// assigning every pixel 0 or 1 in a checkerboard pattern
	// with checkerboard squares with a size of this variable
	float checkerSize = 4.0;
	int x = int(gl_FragCoord.x / checkerSize);
	int y = int(gl_FragCoord.y / checkerSize);
	int checker = (y % 2 == 0) ? (x % 2) : (1 - (x % 2));
	// 0 or 1, should we use checker (inverse of)?
	float useChecker = floor(blend_opacity);
	float opacity = useChecker * blend_opacity + (1.0 - useChecker) * blend_opacity * float(checker);
	gl_FragColor = vec4(blend_color.rgb, opacity);
}
