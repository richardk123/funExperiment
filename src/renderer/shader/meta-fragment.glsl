#version 300 es
#define MAX_STEPS 100
#define MAX_DIST 1000.
#define SURF_DIST .01
#define RESOLUTION_X 1024
#define RESOLUTION_Y 768
#define MAX_OBJECT_COUNT 10

precision mediump float;

uniform vec3 camPos;
uniform vec3 camLookAt;

uniform samplerCube u_skybox;
uniform sampler2D materialsData;
uniform sampler2D instancesData;

in vec2 v_uv;

out vec4 outColor;

struct Material
{
    vec3 color;
    float reflection;
};

struct Modifier
{
    int type;
    float smoothness;
};

struct Shape
{
    int type;
    vec3 dimension;
    float radius;
};

struct Instance
{
    vec3 position;
    int materialId;
    Modifier modifier;
    Shape shape;
};

int instanceCount;
int materialCount;


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

Instance GetInstance(int index)
{
    vec4 texel0 = texelFetch(instancesData, ivec2(0, index), 0);
    vec4 texel1 = texelFetch(instancesData, ivec2(1, index), 0);
    vec4 texel2 = texelFetch(instancesData, ivec2(2, index), 0);
    Instance instance;
    instance.position = texel0.rgb;
    instance.materialId = int(texel0.a);
    instance.modifier.type = int(texel1.r);
    instance.modifier.smoothness = texel1.g;

    instance.shape.type = int(texel1.b);
    instance.shape.radius = texel1.a;
    instance.shape.dimension = texel2.rgb;
    return instance;
}

Material GetMaterial(int index)
{
    Material material;
    vec4 texel0 = texelFetch(materialsData, ivec2(0, index), 0);

    material.color = texel0.rgb;
    material.reflection = texel0.a;
    return material;
}

// return material index by closes instance by point
int GetMaterialIndex(vec3 point)
{
    int mat = 0;
    float dist = MAX_DIST;
    float distCur = MAX_DIST;

    for (int i = 0; i < instanceCount; i++)
    {
        Instance instance = GetInstance(i);
        
        if (instance.shape.type == 0) // box
        {
            distCur = sdBox(point + instance.position, instance.shape.dimension);
        }
        else if (instance.shape.type == 1) // sphere
        {
            distCur = sdSphere(point + instance.position, instance.shape.radius);
        }

        if (distCur < dist)
        {
            dist = distCur;
            mat = instance.materialId;
        }
    }

    return mat;
}

float GetDistance(vec3 point)
{
    float dist = MAX_DIST;
    float distCur = MAX_DIST + 1.;
    int mat = 0;
    
    for (int i = 0; i < instanceCount; i++)
    {
        Instance instance = GetInstance(i);
        
        if (instance.shape.type == 0) // box
        {
            distCur = sdBox(point + instance.position, instance.shape.dimension);
        }
        else if (instance.shape.type == 1) // sphere
        {
            distCur = sdSphere(point + instance.position, instance.shape.radius);
        }

        if (instance.modifier.type == 0)
        {
            dist = min(dist, distCur);
        }
        else if (instance.modifier.type == 1)
        {
            dist = max(dist, -distCur);
        }
        else if (instance.modifier.type == 2)
        {
            dist = smin(dist, distCur, instance.modifier.smoothness);
        }

        mat = instance.materialId;
    }

    return dist;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO = 0.;
    for(int i = 0; i < MAX_STEPS; i++) 
    {
    	vec3 point = ro + rd*dO;
        float dist = GetDistance(point);
        dO += dist;

        if(dO > MAX_DIST || dist < SURF_DIST)
        {
            break;
        }
    }
    
    return dO;
}

vec3 GetNormal(vec3 point) {
	float dist = GetDistance(point);
    vec2 e = vec2(.001, 0);
    
    vec3 n = dist - vec3(
        GetDistance(point-e.xyy),
        GetDistance(point-e.yxy),
        GetDistance(point-e.yyx));
    
    return normalize(n);
}

float GetLight(vec3 point) {
    vec3 lightPos = vec3(0, 5, -6);
    vec3 l = normalize(lightPos-point);
    vec3 n = GetNormal(point);
    
    float dif = clamp(dot(n, l), 0., 1.);
    float dist = RayMarch(point + n*SURF_DIST * 2., l);
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

vec3 GetColor(vec3 point, vec3 skyboxColor)
{
    int materialIndex = GetMaterialIndex(point);
    Material material = GetMaterial(materialIndex);
    return skyboxColor * material.reflection + material.color;
}

void main()
{
    vec2 resolution = vec2(RESOLUTION_X, RESOLUTION_Y);
    vec2 uv = (gl_FragCoord.xy -.5 * resolution.xy) / resolution.y;
    mat3 matrix = calcLookAtMatrix(camPos, camLookAt, 0.);

    materialCount = textureSize(materialsData, 0).y;
    instanceCount = textureSize(instancesData, 0).y;

    vec3 rd = normalize(matrix * vec3(uv.x, uv.y, 1.));

    float dist = RayMarch(camPos, rd);
    vec3 point = camPos + rd * dist;

    float dif = GetLight(point);
    
    vec3 col = texture(u_skybox, rd).rgb;

    if (dist < MAX_DIST)
    {
        vec3 normal = GetNormal(point);
        vec3 reflectDir = reflect(rd, normal);
        vec3 reflectSkyboxColor = texture(u_skybox, reflectDir).rgb;
        col = GetColor(point, reflectSkyboxColor) * dif;
    }
    
    col = pow(col, vec3(.4545));	// gamma correction

    outColor = vec4(col, 1.0);
}