#version 100

precision mediump float;

uniform mat4 u_projection;
uniform mat4 u_modelview;
uniform vec2 u_resolution;
uniform vec2 u_touchWorld;
uniform vec2 u_touchScreen;

// visualize the 3D touch in world coordinates
// by converting back into screen coordinates.
// M = (0.5 scale) * (1,1,0 translate) * (-1 scale)
// where inputs (point, canvas) are scaled using window.devicePixelRatio
// mat4 M = mat4(-0.5,0,0,0,0,-0.5,0,0,0,0,-0.5,0,0.5,0.5,0,1);
// where inputs (point, canvas) are NOT scaled using window.devicePixelRatio
mat4 M = mat4(-1,0,0,0,0,-1,0,0,0,0,-1,0,1,1,0,1);

void main () {
	vec2 touchPoint = (u_projection * vec4(u_touchWorld.xy, 0, 1)).xy;
	vec2 touchPointNormalized = (M * vec4(touchPoint,0,1)).xy;
	vec2 tp = touchPointNormalized * u_resolution;
	float d = distance(gl_FragCoord.xy, tp);
	float alpha = 1.0 - step(10.0, d);
	gl_FragColor = vec4(1.0, 0.8, 0.28, alpha);
}

// // visualize the 2D touch in screen coordinates
// void main () {
// 	vec2 tp = vec2(u_touchScreen.x, u_resolution.y - u_touchScreen.y);
// 	float d = distance(gl_FragCoord.xy, tp);// / uf_resolution);
// 	float alpha = 1.0 - step(15.0, d);
// 	gl_FragColor = vec4(1.0, 0.8, 0.28, alpha);
// }
