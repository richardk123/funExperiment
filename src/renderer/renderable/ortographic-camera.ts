import { Entity } from "tick-knock";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';

export class OrtographicCamera
{
    ORTO_SIZE = 21;

    readonly render: (camera: Entity, program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        //TODO: parametrize from camera
        this.render = (camera, program) =>
        {
            // uniforms
            const matViewUniformLocation = WebglUtils.getUniformLocation(program, 'mView', gl);
            const matProjUniformLocation = WebglUtils.getUniformLocation(program, 'mProj', gl);

            const viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
            gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);

            const projMatrix = new Float32Array(16);
            const aspectRation = gl.canvas.clientWidth / gl.canvas.clientHeight;

            var left = -10 * aspectRation;
            var right = 10 * aspectRation;
            var bottom = 10 * aspectRation;
            var top = -10 * aspectRation;
            var near = 100;
            var far = -100;
            GLM.mat4.ortho(projMatrix, left, right, bottom, top, near, far);
            gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

        }
    }
}