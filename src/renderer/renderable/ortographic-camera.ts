import { Entity } from "tick-knock";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';

export class OrtographicCamera
{

    private renderer: (camera: Entity, program: WebGLProgram) => void;

    ORTO_SIZE = 100;

    constructor(gl: WebGL2RenderingContext)
    {
        //TODO: parametrize from camera
        this.render = (camera, program) =>
        {
            // uniforms
            const matrixUniformLocation = WebglUtils.getUniformLocation(program, 'u_matrix', gl);

            // projection matrix (prevede na -1 to 1 souradnice pro gpu)
            var matrix = new Float32Array(16);
            GLM.mat4.ortho(matrix, this.ORTO_SIZE, this.ORTO_SIZE, this.ORTO_SIZE, this.ORTO_SIZE, 0.1, 1000);
            gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
        }
    }

    public render(camera: Entity, program: WebGLProgram)
    {
        this.renderer(camera, program);
    }
}