#version 100

attribute vec2 v_position;

void main () {
	gl_Position = vec4(v_position, 0, 1);
}
