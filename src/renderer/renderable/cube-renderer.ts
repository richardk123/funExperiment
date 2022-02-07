import { Entity } from "tick-knock";
import * as GLM from 'gl-matrix';
import { Shape } from "../../shape";
import { WebglUtils } from "../webgl-utils";
import { Position } from "../../component/position";
import { Color } from "../../component/color";

export class CubeRenderer
{
    readonly render: (cubes: ReadonlyArray<Entity>, program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext, maxNumberOfInstances: number)
    {
        // color data
        const colorData = new Float32Array(maxNumberOfInstances * 4);
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorData.byteLength, gl.STATIC_DRAW);

        // indicies
        const indiciesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiciesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Shape.cubeIndicies, gl.STATIC_DRAW);

        // cube
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Shape.cube, gl.STATIC_DRAW);

        // cube normals
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Shape.cubeNormals, gl.STATIC_DRAW);

        // world matrix data
        const matrixData = new Float32Array(maxNumberOfInstances * 16);
        const matrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);

        this.render = (cubes, program) =>
        {
            const positionAttribLocation = WebglUtils.getAttribLocation(program, 'vertPosition', gl);
            const colorAttribLocation = WebglUtils.getAttribLocation(program, 'color', gl);
            const normalAttribLocation = WebglUtils.getAttribLocation(program, 'vertNormal', gl);
            const matWorldAttribLocation = WebglUtils.getAttribLocation(program, 'mWorld', gl);
    
            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
    
            // normals
            gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
            gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, true, 0, 0);
            gl.enableVertexAttribArray(normalAttribLocation);
    
            // indicies
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiciesBuffer);
    
            const numInstances = cubes.length;
    
            // martix update
            for (let i = 0; i < numInstances; ++i) 
            {
                const byteOffsetToMatrix = i * 16 * 4;
                const worldMatrix = new Float32Array(matrixData.buffer, byteOffsetToMatrix, 16);
                const positionComponent = cubes[i].get(Position);
    
                GLM.mat4.fromTranslation(worldMatrix, positionComponent.asArray);
    
                // const rotation = cubes[i].get(Rotation);
                // if (rotation)
                // {
                //     // //TODO: rotation
                //     // let xRotationMatrix = new Float32Array(16);
                //     // let yRotationMatrix = new Float32Array(16);
                //     // let zRotationMatrix = new Float32Array(16);
                //     // GLM.mat4.rotate(xRotationMatrix, worldMatrix, rotation.x, [1, 0, 0]);
                //     // GLM.mat4.rotate(yRotationMatrix, worldMatrix, rotation.y, [0, 1, 0]);
                //     // GLM.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
                //     // GLM.mat4.rotate(worldMatrix, worldMatrix, rotation.z, [0, 0, 1]);
                // }
    
                const colorComponent = cubes[i].get(Color);
                const offset = i * 4;
                colorData.set(colorComponent.asArray, offset);
            }
    
    
            // world matrix
            gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);
            const bytesPerMatrix = 4 * 16;
            for (let i = 0; i < 4; ++i) 
            {
                const loc = matWorldAttribLocation + i;
                gl.enableVertexAttribArray(loc);
                const offset = i * 16;
                gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, offset);
                gl.vertexAttribDivisor(loc, 1);
            }
    
            // color
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(colorAttribLocation);
            gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(colorAttribLocation, 1);
         
            gl.drawElementsInstanced(gl.TRIANGLES, Shape.cubeIndicies.length, gl.UNSIGNED_SHORT, 0, numInstances);
    
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    }
}