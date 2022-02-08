import { Entity } from "tick-knock";
import { Shape } from "../shape";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';
import { PespectiveCamera } from "./perspective-camera";
import { EyePosition } from "../../component/camera/eye-pos";
import { LookAtPosition } from "../../component/camera/look-at";

export class Snake
{
    readonly render: (camera: Entity, program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        // quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        this.render = (camera, program) =>
        {
            gl.useProgram(program);

            const positionAttribLocation = WebglUtils.getAttribLocation(program, 'vertPosition', gl);

            const projMatrixLocation = WebglUtils.getUniformLocation(program, 'mProj', gl);
            const viewMatrixLocation = WebglUtils.getUniformLocation(program, 'mView', gl);
            const worldMatrixLocation = WebglUtils.getUniformLocation(program, 'mWorld', gl);

            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, Shape.quad, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

            // Compute the projection matrix
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, PespectiveCamera.FOV, aspect, 0.1, 1000);

            // View matrix
            const eye = camera.get(EyePosition);
            const lookAt = camera.get(LookAtPosition);
            const viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, eye.asArray, lookAt.asArray, [0, 1, 0]);

            const worldMatrix = new Float32Array(16);
            GLM.mat4.identity(worldMatrix);
            GLM.mat4.translate(worldMatrix, worldMatrix, [0, 0, -1]);
            GLM.mat4.rotateX(worldMatrix, worldMatrix, 0);
            GLM.mat4.rotateY(worldMatrix, worldMatrix, 0);
            GLM.mat4.rotateZ(worldMatrix, worldMatrix, 0);
            GLM.mat4.scale(worldMatrix, worldMatrix, [10, 10, 0]);

            gl.uniformMatrix4fv(projMatrixLocation, false, projMatrix);
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
            gl.uniformMatrix4fv(worldMatrixLocation, false, worldMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
}