precision mediump float;

attribute vec3 vertPosition;
attribute vec3 color;
attribute mat4 mWorld;

uniform mat4 mView;
uniform mat4 mProj;

varying vec3 v_color;

void main() {
    v_color = color;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}