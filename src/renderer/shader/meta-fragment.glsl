#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
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
    return 0.5*((a+b)-sqrt(h*h+k));
}

float sdSphere(vec3 p, float s)
{
    return length(p) - s;
}

float GetDist(vec3 p)
{
    float distance = smin(
                sdSphere(p - playerSpheres[0], 0.3),
                sdSphere(p - playerSpheres[1], 0.3), 0.2);

    for (int i = 2; i < MAX_OBJECT_COUNT; i++)
    {
        if (i >= playerSpheresCount)
        {
            break;
        }
        distance = smin(distance, sdSphere(p - playerSpheres[i], 0.3), 0.2);
    }

    // return distance;
    float planeDist = p.y;
    return min(planeDist, distance);
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || dS<SURF_DIST) break;
    }
    
    return dO;
}

vec3 GetNormal(vec3 p) {
	float d = GetDist(p);
    vec2 e = vec2(.001, 0);
    
    vec3 n = d - vec3(
        GetDist(p-e.xyy),
        GetDist(p-e.yxy),
        GetDist(p-e.yyx));
    
    return normalize(n);
}

float GetLight(vec3 p) {
    vec3 lightPos = vec3(0, 5, -6);
    vec3 l = normalize(lightPos-p);
    vec3 n = GetNormal(p);
    
    float dif = clamp(dot(n, l), 0., 1.);
    float d = RayMarch(p+n*SURF_DIST*2., l);
    if(d<length(lightPos-p)) dif *= .1;
    
    return dif;
}

void main()
{
    vec2 resolution = vec2(RESOLUTION_X, RESOLUTION_Y);
    vec2 uv = (gl_FragCoord.xy -.5 * resolution.xy) / resolution.y;

    vec3 col = vec3(0);
    
    vec3 cLook = normalize(camLookAt);
    vec3 ro = camPos;
    vec3 rd = normalize(vec3(uv.x-camLookAt.x, uv.y-camLookAt.y, 1));

    float d = RayMarch(ro, rd);
    
    vec3 p = ro + rd * d;
    
    float dif = GetLight(p);
    col = vec3(dif);
    
    col = pow(col, vec3(.4545));	// gamma correction

    gl_FragColor = vec4(col, 1.0);
}