import { Entity } from "tick-knock";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';
import { EyePosition } from "../../component/camera/eye-pos";
import { LookAtPosition } from "../../component/camera/look-at";

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

            const eye = camera.get(EyePosition);
            const lookAt = camera.get(LookAtPosition);

            gl.uniform3fv(camPosLocation, eye.asArray);
            gl.uniform3fv(camLookAtLocation, lookAt.asArray);
        }
    }

}