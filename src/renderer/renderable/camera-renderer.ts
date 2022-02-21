import { Entity } from "tick-knock";
import { WebglUtils } from "../webgl-utils";
import { LookAtPosition } from "../../component/camera/look-at";
import { Position } from "../../component/position";

export class CameraRenderer
{
    readonly render: (camera: Entity, program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        this.render = (camera, program) =>
        {
            gl.useProgram(program);

            const camPosLocation = WebglUtils.getUniformLocation(program, 'camPos', gl);
            const camLookAtLocation = WebglUtils.getUniformLocation(program, 'camLookAt', gl);

            const eye = camera.get(Position);
            const lookAt = camera.get(LookAtPosition);

            gl.uniform3fv(camPosLocation, eye.asArray);
            gl.uniform3fv(camLookAtLocation, lookAt.asArray);
        }
    }

}