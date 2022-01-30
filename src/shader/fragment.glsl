precision highp float;
uniform vec4 metaballs[100];
uniform int metaballsCount;
const float WIDTH = 1024.0;
const float HEIGHT = 768.0;

void main()
{
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    float radiusCoef = 0.0;
    float massCoef = 0.0;

    for (int i = 0; i < 300; i++)
    {
        if (i >= metaballsCount)
        {
            break;
        }
        vec4 mb = metaballs[i];
        float dx = mb.x - x;
        float dy = mb.y - y;
        float r = mb.z;
        float mass = mb.w;

        vec2 metaballPos = vec2(mb.x, mb.y);
        vec2 pixelPos = vec2(x, y);
        float distance = distance(metaballPos, pixelPos);
        radiusCoef += r * r / (distance * distance) * 250.0;
    }

    float red = min(radiusCoef, 255.0) / 255.0;
    float green = min(radiusCoef / 1.5, 255.0) / 255.0;
    float blue = min((radiusCoef / 3.0), 255.0) / 255.0;
    gl_FragColor = vec4(red, green, blue, 1.0);
}