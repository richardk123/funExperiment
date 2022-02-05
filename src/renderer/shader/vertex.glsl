precision mediump float;

attribute vec3 vertPosition;
attribute vec3 color;
attribute mat4 mWorld;
attribute vec3 vertNormal;

uniform mat4 mView;
uniform mat4 mProj;

varying vec3 v_color;
varying vec3 v_normal;

void main() {
    v_color = color;
    v_normal = (mWorld * vec4(vertNormal, 0.0)).xyz;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}