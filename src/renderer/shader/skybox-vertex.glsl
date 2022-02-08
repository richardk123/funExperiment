precision mediump float;

attribute vec4 vertPosition;
varying vec4 v_position;

void main() 
{
  v_position = vertPosition;
  gl_Position = vertPosition;
  gl_Position.z = 1.0;
}