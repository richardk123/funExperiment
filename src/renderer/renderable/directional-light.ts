import { Entity } from "tick-knock";
import { Direction } from "../../component/direction";
import { AmbientLightIntensity } from "../../component/light/abmient-light-intensity";
import { SunlightIntensity } from "../../component/light/sun-light-intensity";
import { WebglUtils } from "../webgl-utils";

export class DirectionalLight
{
    readonly render: (sun: Entity, program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        this.render = (sun, program) =>
        {
            gl.useProgram(program);
            // lighting
            const ambientLightIntensity = sun.get(AmbientLightIntensity);
            const sunlightIntensity = sun.get(SunlightIntensity);
            const sunLightDirection = sun.get(Direction);

            const ambientLightIntensityUniformLocation = WebglUtils.getUniformLocation(program, 'ambientLightIntensity', gl);
            const sunlightIntensityUniformLocation = WebglUtils.getUniformLocation(program, 'sunlightIntensity', gl);
            const sunlightDirectionLocation = WebglUtils.getUniformLocation(program, 'sunlightDirection', gl);

            gl.uniform3f(ambientLightIntensityUniformLocation, ambientLightIntensity.x, ambientLightIntensity.y, ambientLightIntensity.z);
            gl.uniform3f(sunlightIntensityUniformLocation, sunlightIntensity.x, sunlightIntensity.y, sunlightIntensity.z);
            gl.uniform3f(sunlightDirectionLocation, sunLightDirection.x, sunLightDirection.y, sunLightDirection.z);
        }
    }
}