precision mediump float;

attribute vec3 vertPosition;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() 
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertPosition, 1.0);
}