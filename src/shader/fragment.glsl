precision highp float;
uniform vec3 metaballs[100];
uniform int metaballsCount;
const float WIDTH = 1024.0;
const float HEIGHT = 768.0;

void main(){
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float v = 0.0;
    for (int i = 0; i < 300; i++) {
        if (i >= metaballsCount)
        {
            break;
        }
        vec3 mb = metaballs[i];
        float dx = mb.x - x;
        float dy = mb.y - y;
        float r = mb.z;

        vec2 metaballPos = vec2(mb.x, mb.y);
        vec2 pixelPos = vec2(x, y);
        float distance = distance(metaballPos, pixelPos);
        v += r*r / (distance * distance) * 250.0;
    }

    float color = min(v, 255.0) / 255.0;
    gl_FragColor = vec4(color, 0, 0.0, 1.0);
}