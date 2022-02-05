precision mediump float;

uniform vec3 ambientLightIntensity;
uniform vec3 sunlightIntensity;
uniform vec3 sunlightDirection;

varying vec4 v_color;
varying vec3 v_normal;

void main()
{
    vec3 normSunDirection = normalize(sunlightDirection);
    vec3 lightIntensity = ambientLightIntensity + sunlightIntensity * max(dot(v_normal, normSunDirection), 0.0);
    gl_FragColor = vec4(v_color.xyz + lightIntensity, v_color.a);
}