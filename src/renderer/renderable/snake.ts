import { Entity } from "tick-knock";
import { Shape } from "../shape";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';
import { PespectiveCamera } from "./perspective-camera";
import { EyePosition } from "../../component/camera/eye-pos";
import { LookAtPosition } from "../../component/camera/look-at";
import { Position } from "../../component/position";
import { Body } from "../../component/player/body";

export class Snake
{
    readonly render: (camera: Entity, program: WebGLProgram, player: Entity) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        // quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        this.render = (camera, program, player) =>
        {
            gl.useProgram(program);

            const positionAttribLocation = WebglUtils.getAttribLocation(program, 'vertPosition', gl);

            const projMatrixLocation = WebglUtils.getUniformLocation(program, 'mProj', gl);
            const viewMatrixLocation = WebglUtils.getUniformLocation(program, 'mView', gl);
            const worldMatrixLocation = WebglUtils.getUniformLocation(program, 'mWorld', gl);
            const camPosLocation = WebglUtils.getUniformLocation(program, 'camPos', gl);
            const camLookAtLocation = WebglUtils.getUniformLocation(program, 'camLookAt', gl);
            const playerSpheresLocation = WebglUtils.getUniformLocation(program, 'playerSpheres', gl);
            const playerSpheresCountLocation = WebglUtils.getUniformLocation(program, 'playerSpheresCount', gl);

            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, Shape.quad, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

            // player
            const bodyParts = player.get(Body);
            const playerData = new Float32Array(3 * bodyParts.bodyPositions.length);
            bodyParts.bodyPositions
                .forEach((position, index) =>
                {
                    const baseIndex = 3 * index;
                    playerData[baseIndex + 0] = position.x;
                    playerData[baseIndex + 1] = position.y;
                    playerData[baseIndex + 2] = position.z;
                });
                
            gl.uniform3fv(playerSpheresLocation, playerData);
            gl.uniform1i(playerSpheresCountLocation, bodyParts.bodyPositions.length);

            // Compute the projection matrix
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, PespectiveCamera.FOV, aspect, 0.1, 1000);

            // View matrix
            const eye = camera.get(EyePosition);
            const lookAt = camera.get(LookAtPosition);
            const viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, eye.asArray, lookAt.asArray, [0, 1, 0]);

            // world matrix
            const worldMatrix = new Float32Array(16);
            GLM.mat4.identity(worldMatrix);
            GLM.mat4.translate(worldMatrix, worldMatrix, [0, 0, 0]);
            GLM.mat4.rotateX(worldMatrix, worldMatrix, 0);
            GLM.mat4.rotateY(worldMatrix, worldMatrix, 0);
            GLM.mat4.rotateZ(worldMatrix, worldMatrix, 0);
            GLM.mat4.scale(worldMatrix, worldMatrix, [1, 1, 1]);

            gl.uniformMatrix4fv(projMatrixLocation, false, projMatrix);
            gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
            gl.uniformMatrix4fv(worldMatrixLocation, false, worldMatrix);
            gl.uniform3fv(camPosLocation, eye.asArray);
            gl.uniform3fv(camLookAtLocation, lookAt.asArray);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
}