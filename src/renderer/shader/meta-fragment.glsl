#version 300 es
#define MAX_STEPS 100
#define MAX_DIST 30.
#define SURF_DIST .0001
#define RESOLUTION_X 1024
#define RESOLUTION_Y 768
#define MAX_OBJECT_COUNT 10

precision mediump float;

uniform vec3 camPos;
uniform vec3 camLookAt;

uniform samplerCube u_skybox;
uniform sampler2D materialsData;

in vec2 v_uv;

out vec4 outColor;

const int MAT_DEFAULT = 0;
const int MAT_SNAKE = 1;
const int MAT_BOX = 2;
const int MAT_PLANE = 3;

struct material
{
    vec4 color;
};

material[5] materials;


float smin(float a, float b, float k)
{
    float h = a-b;
    return 0.5*((a+b)-sqrt(h*h+k));
}

float sdBox( vec3 point, vec3 b )
{
  vec3 q = abs(point) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdSphere(vec3 point, float s)
{
    return length(point) - s;
}

float sdCapsule(vec3 point, vec3 a, vec3 b, float r)
{
    vec3 pa = point - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

vec2 GetDistMat(vec3 point)
{
    float planeDist = point.y;
    float boxDist = sdBox(point + vec3(3, 0, 2), vec3(1));

    float dist = min(boxDist, planeDist);
    int mat = MAT_DEFAULT;

    if (dist == boxDist)
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
    	vec3 point = ro + rd*dO;
        vec2 distMat = GetDistMat(point);
        dO += distMat.x;

        if(dO > MAX_DIST || distMat.x < SURF_DIST)
        {
            matHit = distMat.y;
            break;
        }
    }
    
    return vec2(dO, matHit);
}

vec3 GetNormal(vec3 point) {
	float dist = GetDistMat(point).x;
    vec2 e = vec2(.001, 0);
    
    vec3 n = dist - vec3(
        GetDistMat(point-e.xyy).x,
        GetDistMat(point-e.yxy).x,
        GetDistMat(point-e.yyx).x);
    
    return normalize(n);
}

float GetLight(vec3 point) {
    vec3 lightPos = vec3(0, 5, -6);
    vec3 l = normalize(lightPos-point);
    vec3 n = GetNormal(point);
    
    float dif = clamp(dot(n, l), 0., 1.);
    float dist = RayMarch(point+n*SURF_DIST*2., l).x;
    if(dist < length(lightPos-point)) dif *= .1;
    
    return dif;
}

mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

vec3 GetMaterial(vec2 distMat, vec3 skyboxColor)
{
    int mat = int(distMat.y);

    if (mat == MAT_DEFAULT)
    {
        return vec3(1, 1, 1);
    }
    else if (mat == MAT_BOX)
    {
        return materials[0].color.rgb;
    }
    else if (mat == MAT_SNAKE)
    {
        return skyboxColor;
    }
    else if (mat == MAT_PLANE)
    {
        return skyboxColor * 0.9 * vec3(1, 0, 1);
    }
}

void loadMaterials()
{
    ivec2 size = textureSize(materialsData, 0);

    for (int y = 0; y < size.y; ++y) {
        materials[y].color = texelFetch(materialsData, ivec2(0, y), 0);
    }
}

void main()
{
    vec2 resolution = vec2(RESOLUTION_X, RESOLUTION_Y);
    vec2 uv = (gl_FragCoord.xy -.5 * resolution.xy) / resolution.y;
    mat3 matrix = calcLookAtMatrix(camPos, camLookAt, 0.);

    loadMaterials();

    vec3 rd = normalize(matrix * vec3(uv.x, uv.y, 1.));

    vec2 distMat = RayMarch(camPos, rd);
    vec3 point = camPos + rd * distMat.x;


    float dif = GetLight(point);
    
    vec3 col = texture(u_skybox, rd).rgb;

    if (distMat.x < MAX_DIST)
    {
        vec3 normal = GetNormal(point);
        vec3 reflectDir = reflect(rd, normal);
        vec3 reflectSkyboxColor = texture(u_skybox, reflectDir).rgb;
        col = GetMaterial(distMat, reflectSkyboxColor) * dif;
    }
    
    col = pow(col, vec3(.4545));	// gamma correction

    outColor = vec4(col, 1.0);
}