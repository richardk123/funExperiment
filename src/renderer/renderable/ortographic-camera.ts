import { Entity } from "tick-knock";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';

export class OrtographicCamera
{


    ORTO_SIZE = 100;

    constructor(gl: WebGL2RenderingContext)
    {
        //TODO: parametrize from camera
        this.render = (camera, program) =>
        {
            // uniforms
            const modelViewMatrixUniformLocation = WebglUtils.getUniformLocation(program, 'modelViewMatrix', gl);
            const projectionMatrixUniformLocation = WebglUtils.getUniformLocation(program, 'projectionMatrix', gl);

            var modelViewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(modelViewMatrix, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
            gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

            // projection matrix (prevede na -1 to 1 souradnice pro gpu)
            var projectionMatrix = new Float32Array(16);
            GLM.mat4.ortho(projectionMatrix, this.ORTO_SIZE, this.ORTO_SIZE, this.ORTO_SIZE, this.ORTO_SIZE, 0.1, 1000);
            gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
        }
    }

    public render(camera: Entity, program: WebGLProgram)
    {
    }
}