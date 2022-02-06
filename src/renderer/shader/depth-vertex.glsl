precision mediump float;

attribute vec3 vertPosition;
uniform mat4 u_matrix;

attribute mat4 mWorld;

void main() 
{
    gl_Position = u_matrix * mWorld * vec4(vertPosition, 1.0);
}