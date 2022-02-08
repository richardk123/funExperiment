precision mediump float;

uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 mWorld;
uniform vec3 camPos;
uniform vec3 camLookAt;
uniform vec3 sunlightDirection;
varying vec2 v_uv;

float smin( float a, float b, float k )
{
    float h = a-b;
    return 0.5*( (a+b) - sqrt(h*h+k) );
}

float createSphere( vec3 p, float s )
{
    return length(p) - s;
}

float createBox(vec3 p, vec3 b)
{
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float calcDistance(vec3 p)
{
    vec4 cube1Pos = mProj * mView * mWorld * (vec4(p, 1.0) + vec4(1.0, 0.0, 0.0, 1.0));
    vec4 cube2Pos  = mProj * mView * mWorld * (vec4(p, 1.0) + vec4(-1.0, 0.0, 0.0, 1.0));

    return smin(
        createSphere(cube1Pos.xyz, 0.6),
        createSphere(cube2Pos.xyz, 0.6),
        0.2);
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
    vec2 resolution = vec2(1024.0 / 768.0, 1.0);

    vec3 cameraPos = (mProj * mView * mWorld * vec4(camPos, 1.0)).xyz;
    vec3 lightDirection = normalize(sunlightDirection);
    vec3 uvNormal = normalize(vec3((v_uv - vec2(0.5)) * resolution, -1));
    vec3 rayDirection = uvNormal;

    vec3 rayPos = cameraPos;
    float distance = 0.0;
    float distanceMax = 1000.0;

    for (int i = 0; i < 256; i++)
    {
        vec3 pos = cameraPos + distance * rayDirection;
        float currentDistance = calcDistance(pos);

        distance += currentDistance;

        if (currentDistance < 0.01 || distance > distanceMax)
        {
            break;
        }
    }

    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

    if (distance < distanceMax)
    {
        vec3 finalPosition = cameraPos + distance * rayDirection;
        vec3 normal = calcNormal(finalPosition);
        color = vec4(1.0);

        float diff = dot(lightDirection, normal);
        color = vec4(diff, diff, diff, 1.0);
    }

    gl_FragColor = color;
}