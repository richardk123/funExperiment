import { Entity } from "tick-knock";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';
import { EyePosition } from "../../component/camera/eye-pos";
import { LookAtPosition } from "../../component/camera/look-at";

export class PespectiveCamera
{
    static FOV = GLM.glMatrix.toRadian(90);

    readonly render: (camera: Entity, program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        this.render = (camera, program) =>
        {
            gl.useProgram(program);

            const eye = camera.get(EyePosition);
            const lookAt = camera.get(LookAtPosition);

            // uniforms
            const matViewUniformLocation = WebglUtils.getUniformLocation(program, 'mView', gl);
            const matProjUniformLocation = WebglUtils.getUniformLocation(program, 'mProj', gl);

            // view matrix
            const viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, eye.asArray, lookAt.asArray, [0, 1, 0]);
            gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
            
            // projection matrix (prevede na -1 to 1 souradnice pro gpu)
            const aspectRation = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, PespectiveCamera.FOV, aspectRation, 0.1, 1000.0);
            gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);
        }
    }

}