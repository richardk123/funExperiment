precision mediump float;

attribute vec3 vertPosition;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

varying vec2 v_uv;


void main()
{
    gl_Position = vec4(vertPosition, 1.0);

    // Convert from clipspace to colorspace.
    // Clipspace goes -1.0 to +1.0
    // Colorspace goes from 0.0 to 1.0
    v_uv = gl_Position.xy * 0.5 + 0.5;
}