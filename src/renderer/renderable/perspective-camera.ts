import { Entity } from "tick-knock";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';

export class PespectiveCamera
{
    constructor(gl: WebGL2RenderingContext)
    {
        //TODO: parametrize from camera
        this.render = (camera, program) =>
        {
            // uniforms
            const matViewUniformLocation = WebglUtils.getUniformLocation(program, 'mView', gl);
            const matProjUniformLocation = WebglUtils.getUniformLocation(program, 'mProj', gl);

            // view matrix
            var viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
            gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
            
            // projection matrix (prevede na -1 to 1 souradnice pro gpu)
            const aspectRation = gl.canvas.clientWidth / gl.canvas.clientHeight;
            var projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, GLM.glMatrix.toRadian(45), aspectRation, 0.1, 1000.0);
            gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);
        }
    }

    public render(camera: Entity, program: WebGLProgram)
    {
    }
}