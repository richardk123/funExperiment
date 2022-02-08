import { Entity } from "tick-knock";
import * as GLM from 'gl-matrix';
import { Shape } from "../shape";
import { WebglUtils } from "../webgl-utils";
import { Position } from "../../component/position";
import { Color } from "../../component/color";
import { Scale } from "../../component/scale";
import { Rotation } from "../../component/rotation";

export class Cube
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
            gl.useProgram(program);
            
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
                
                const position = cubes[i].get(Position);
                const scale = cubes[i].get(Scale);
                const rotation = cubes[i].get(Rotation);
    
                GLM.mat4.identity(worldMatrix);
                GLM.mat4.translate(worldMatrix, worldMatrix, position.asArray);
                GLM.mat4.rotateX(worldMatrix, worldMatrix, rotation.x);
                GLM.mat4.rotateY(worldMatrix, worldMatrix, rotation.y);
                GLM.mat4.rotateZ(worldMatrix, worldMatrix, rotation.z);
                GLM.mat4.scale(worldMatrix, worldMatrix, scale.asArray);
    
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