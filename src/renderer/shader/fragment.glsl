precision mediump float;

uniform vec3 ambientLightIntensity;
uniform vec3 sunlightIntensity;
uniform vec3 sunlightDirection;

varying vec3 v_color;
varying vec3 v_normal;

void main()
{
    // vec3 ambientLightIntensity = vec3(0.3, 0.3, 0.3);
    // vec3 sunlightIntensity = vec3(0.4, 0.4, 0.4);
    // vec3 sunlightDirection = normalize(vec3(10.0, 10.0, 2.0));

    vec3 normSunDirection = normalize(sunlightDirection);
    vec3 lightIntensity = ambientLightIntensity + sunlightIntensity * max(dot(v_normal, normSunDirection), 0.0);
    gl_FragColor = vec4(v_color + lightIntensity, 1.0);
    // gl_FragColor = vec4(v_color, 1.0);
}