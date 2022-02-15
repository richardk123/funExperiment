import { Entity } from "tick-knock";
import { Direction } from "../../component/direction";
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
            const sunLightDirection = sun.get(Direction);

            const sunlightDirectionLocation = WebglUtils.getUniformLocation(program, 'sunlightDirection', gl);

            gl.uniform3f(sunlightDirectionLocation, sunLightDirection.x, sunLightDirection.y, sunLightDirection.z);
        }
    }
}