#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .0001
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

const int MAT_DEFAULT = 0;
const int MAT_SNAKE = 1;
const int MAT_BOX = 2;
const int MAT_PLANE = 3;

float smin(float a, float b, float k)
{
    float h = a-b;
    return 0.5*((a+b)-sqrt(h*h+k));
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdSphere(vec3 p, float s)
{
    return length(p) - s;
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r)
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float GetDistSnake(vec3 p)
{
    float dist = smin(
                    sdCapsule(p, playerSpheres[0], playerSpheres[1], 0.1),
                    sdCapsule(p, playerSpheres[1], playerSpheres[2], 0.1), 
                    0.1);

    for (int i = 1; i < MAX_OBJECT_COUNT; i++)
    {
        if (i >= playerSpheresCount - 1)
        {
            break;
        }

        dist = smin(
                    dist,
                    sdCapsule(p, playerSpheres[i + 0], playerSpheres[i + 1], 0.1), 
                    0.1);
    }
    return dist;
}

vec2 GetDistMat(vec3 p)
{
    float snakeDist = GetDistSnake(p);
    float planeDist = p.y;
    float boxDist = sdBox(p + vec3(3, 0, 2), vec3(1));

    float dist = min(boxDist, min(snakeDist, planeDist));
    int mat = MAT_DEFAULT;

    if (dist == snakeDist)
    {
        mat = MAT_SNAKE;
    }
    else if (dist == boxDist)
    {
        mat = MAT_BOX;
    }
    else if (dist == planeDist)
    {
        mat = MAT_PLANE;
    }

    return vec2(dist, mat);
}

vec2 RayMarch(vec3 ro, vec3 rd) {
	float dO = 0.;
    float matHit = 0.;
    
    for(int i = 0; i < MAX_STEPS; i++) 
    {
    	vec3 p = ro + rd*dO;
        vec2 distMat = GetDistMat(p);
        dO += distMat.x;

        if(dO > MAX_DIST || distMat.x < SURF_DIST)
        {
            matHit = distMat.y;
            break;
        }
    }
    
    return vec2(dO, matHit);
}

vec3 GetNormal(vec3 p) {
	float dist = GetDistMat(p).x;
    vec2 e = vec2(.001, 0);
    
    vec3 n = dist - vec3(
        GetDistMat(p-e.xyy).x,
        GetDistMat(p-e.yxy).x,
        GetDistMat(p-e.yyx).x);
    
    return normalize(n);
}

float GetLight(vec3 p) {
    vec3 lightPos = vec3(0, 5, -6);
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);
    
    float dif = clamp(dot(n, l), 0., 1.);
    float dist = RayMarch(p+n*SURF_DIST*2., l).x;
    if(dist<length(lightPos-p)) dif *= .1;
    
    return dif;
}

mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

void main()
{
    vec2 resolution = vec2(RESOLUTION_X, RESOLUTION_Y);
    vec2 uv = (gl_FragCoord.xy -.5 * resolution.xy) / resolution.y;
    mat3 matrix = calcLookAtMatrix(camPos, camLookAt, 0.);

    vec3 rd = normalize(matrix * vec3(uv.x, uv.y, 1.));

    // distance and material
    vec2 distMat = RayMarch(camPos, rd);
    int mat = int(distMat.y);
    
    vec3 p = camPos + rd * distMat.x;
    
    float dif = GetLight(p);
    
    vec3 col = vec3(0);
    col = vec3(dif);

    if (mat == MAT_DEFAULT)
    {
        col *= vec3(1, 1, 1);
    }
    else if (mat == MAT_BOX)
    {
        col *= vec3(1, 0, 0);
    }
    else if (mat == MAT_SNAKE)
    {
        col *= vec3(0, 1, 0);
    }
    else if (mat == MAT_PLANE)
    {
        col *= vec3(0, 0, 1);
    }
    
    col = pow(col, vec3(.4545));	// gamma correction

    gl_FragColor = vec4(col, 1.0);
}