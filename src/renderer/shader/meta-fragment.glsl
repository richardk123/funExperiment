#define DISTANCE_MAX 1000.0
#define DISTANCE_MIN 0.01
#define RESOLUTION_X 1024
#define RESOLUTION_Y 768
#define MAX_OBJECT_COUNT 10

precision mediump float;

uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mWorld;
uniform vec3 camPos;
uniform vec3 camLookAt;
uniform vec3 sunlightDirection;
uniform vec3 playerSpheres[10];
uniform int playerSpheresCount;

varying vec2 v_uv;

float smin(float a, float b, float k)
{
    float h = a-b;
    return 0.5*( (a+b) - sqrt(h*h+k) );
}

float sdSphere(vec3 p, vec3 spherePos, float s)
{
    vec4 cube1Pos = mProj * mView * mWorld * (vec4(p, 1.0) + vec4(spherePos, 1.0));
    return length(cube1Pos.xyz) - s;
}

float calcDistance(vec3 p)
{
    float distance = smin(
                sdSphere(p, playerSpheres[0], 0.6),
                sdSphere(p, playerSpheres[1], 0.6),
                0.2);

    for (int i = 2; i < MAX_OBJECT_COUNT; i++)
    {
        if (i >= playerSpheresCount)
        {
            break;
        }
        distance = smin(distance, sdSphere(p, playerSpheres[i], 0.6), 0.2);
    }

    return distance;
}

vec3 calcNormal(vec3 p) // for function f(p)
{
    const float eps = 0.001; // or some other value
    const vec2 h = vec2(eps,0);
    return normalize(vec3(
        calcDistance(p+h.xyy) - calcDistance(p-h.xyy),
        calcDistance(p+h.yxy) - calcDistance(p-h.yxy),
        calcDistance(p+h.yyx) - calcDistance(p-h.yyx)));
}

void main()
{
    vec2 resolution = vec2(RESOLUTION_X / RESOLUTION_Y, 1.0);

    vec3 cameraPos = (mProj * mView * mWorld * vec4(camPos, 1.0)).xyz;
    vec3 lightDirection = normalize(sunlightDirection);
    vec3 uvNormal = normalize(vec3((v_uv - vec2(0.5)) * resolution, -1));
    vec3 rayDirection = uvNormal;

    vec3 rayPos = cameraPos;
    float distance = 0.0;

    for (int i = 0; i < 256; i++)
    {
        vec3 pos = cameraPos + distance * rayDirection;
        float currentDistance = calcDistance(pos);

        distance += currentDistance;

        if (currentDistance < DISTANCE_MIN || distance > DISTANCE_MAX)
        {
            break;
        }
    }

    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

    if (distance < DISTANCE_MAX)
    {
        vec3 finalPosition = cameraPos + distance * rayDirection;
        vec3 normal = calcNormal(finalPosition);
        color = vec4(1.0);

        float diff = dot(lightDirection, normal);
        color = vec4(diff, diff, diff, 1.0);
    }

    gl_FragColor = color;
}