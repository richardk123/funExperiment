import { Entity } from "tick-knock";
import { Shape } from "../shape";
import { WebglUtils } from "./webgl-utils";
import * as GLM from 'gl-matrix';
import { Color } from "../component/color";
import { Position } from "../component/position";

export class CubeRenderer
{
    private gl: WebGL2RenderingContext

    private colorData: Float32Array;
    private colorBuffer: WebGLBuffer;

    private matrixData: Float32Array;
    private matrixBuffer: WebGLBuffer;

    private positionBuffer: WebGLBuffer;

    private normalBuffer: WebGLBuffer;

    private indiciesBuffer: WebGLBuffer;


    constructor(gl: WebGL2RenderingContext, maxNumberOfInstances: number)
    {
        this.gl = gl;

        // color data
        this.colorData = new Float32Array(maxNumberOfInstances * 4);
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorData.byteLength, gl.STATIC_DRAW);

        // indicies
        this.indiciesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Shape.cubeIndicies, gl.STATIC_DRAW);

        // cube
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Shape.cube, gl.STATIC_DRAW);

        // cube normals
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Shape.cubeNormals, gl.STATIC_DRAW);

        // world matrix data
        this.matrixData = new Float32Array(maxNumberOfInstances * 16);
        this.matrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.matrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.matrixData.byteLength, gl.DYNAMIC_DRAW);
    }

    public renderCubes(cubes: ReadonlyArray<Entity>, program: WebGLProgram): void
    {
        const positionAttribLocation = WebglUtils.getAttribLocation(program, 'vertPosition', this.gl);
        const colorAttribLocation = WebglUtils.getAttribLocation(program, 'color', this.gl);
        const normalAttribLocation = WebglUtils.getAttribLocation(program, 'vertNormal', this.gl);
        const matWorldAttribLocation = WebglUtils.getAttribLocation(program, 'mWorld', this.gl);

        // position
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(positionAttribLocation);
        this.gl.vertexAttribPointer(positionAttribLocation, 3, this.gl.FLOAT, false, 0, 0);

        // normals
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.vertexAttribPointer(normalAttribLocation, 3, this.gl.FLOAT, true, 0, 0);
        this.gl.enableVertexAttribArray(normalAttribLocation);

        // indicies
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indiciesBuffer);

        const numInstances = cubes.length;

        // martix update
        for (let i = 0; i < numInstances; ++i) 
        {
            const byteOffsetToMatrix = i * 16 * 4;
            const worldMatrix = new Float32Array(this.matrixData.buffer, byteOffsetToMatrix, 16);
            const positionComponent = cubes[i].get(Position);

            GLM.mat4.fromTranslation(worldMatrix, positionComponent.position);

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
            this.colorData.set(colorComponent.color, offset);
        }


        // world matrix
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.matrixBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.matrixData);
        const bytesPerMatrix = 4 * 16;
        for (let i = 0; i < 4; ++i) 
        {
            const loc = matWorldAttribLocation + i;
            this.gl.enableVertexAttribArray(loc);
            const offset = i * 16;
            this.gl.vertexAttribPointer(loc, 4, this.gl.FLOAT, false, bytesPerMatrix, offset);
            this.gl.vertexAttribDivisor(loc, 1);
        }

        // color
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colorData, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(colorAttribLocation);
        this.gl.vertexAttribPointer(colorAttribLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.vertexAttribDivisor(colorAttribLocation, 1);
     

        this.gl.drawElementsInstanced(this.gl.TRIANGLES, Shape.cubeIndicies.length, this.gl.UNSIGNED_SHORT, 0, numInstances);

        // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
}