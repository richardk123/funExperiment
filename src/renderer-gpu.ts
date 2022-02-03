import { Renderer} from "./renderer";
import * as GLM from 'gl-matrix'
import vertexShaderFile from '!!raw-loader!./shader/vertex.glsl';
import fragmentShaderFile from '!!raw-loader!./shader/fragment.glsl';
import { Shape } from "./shape";
import { Position } from "./component/position";
import { Color } from "./component/color";
import { Entity } from "tick-knock";
import { Rotation } from "./component/rotation";

export class RendererGpu implements Renderer
{
    gl: WebGLRenderingContext;
    width: number;
    height: number;
    renderFunc: (entities: ReadonlyArray<Entity>) => void;

    static MAX_NUMBER_OF_INSTANCES = Math.pow(20, 2);

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl2');
        
        // optimalizations
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);

        // vertex and fragment shaders
        var vertexShader = this.compileShader(gl.VERTEX_SHADER , vertexShaderFile, gl);
        var fragmentShader = this.compileShader(gl.FRAGMENT_SHADER ,fragmentShaderFile, gl);

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        // validate and print
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
        {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }
        
        // indicies
        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Shape.cubeIndicies, gl.STATIC_DRAW);

        // attributes and uniforms
        let positionAttribLocation = this.getAttribLocation(program, 'vertPosition', gl);
        let colorAttribLocation = this.getAttribLocation(program, 'color', gl);
        let matWorldAttribLocation = this.getAttribLocation(program, 'mWorld', gl);
        
        let matViewUniformLocation = this.getUniformLocation(program, 'mView', gl);
        let matProjUniformLocation = this.getUniformLocation(program, 'mProj', gl);
        
        // world matrix data
        const matrixData = new Float32Array(RendererGpu.MAX_NUMBER_OF_INSTANCES * 16);
        let matrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);

        // set all 4 attributes for world matrix
        const bytesPerMatrix = 4 * 16;
        for (let i = 0; i < 4; ++i) 
        {
            const loc = matWorldAttribLocation + i;
            gl.enableVertexAttribArray(loc);
            const offset = i * 16;
            gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, offset);
            gl.vertexAttribDivisor(loc, 1);
        }

        // color data
        const colorData = new Float32Array(RendererGpu.MAX_NUMBER_OF_INSTANCES * 4);
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorData.byteLength, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(colorAttribLocation);
        gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(colorAttribLocation, 1);

        // cube
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Shape.cube, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

        gl.useProgram(program);
        
        // set global parameters
        this.gl = gl;
        this.width = canvas.width;
        this.height = canvas.height;

        // parameters
        const identityMatrix = new Float32Array(16);
        GLM.mat4.identity(identityMatrix);

        this.renderFunc = (cubes) =>
        {
            const numInstances = cubes.length;

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // view matrix
            var viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
            this.gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
            
            // projection matrix
            const aspectRation = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            var projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, GLM.glMatrix.toRadian(45), aspectRation, 0.1, 1000.0);
            this.gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);


            {
                // martix update
                for (let i = 0; i < numInstances; ++i) 
                {
                    const byteOffsetToMatrix = i * 16 * 4;
                    const worldMatrix = new Float32Array(matrixData.buffer, byteOffsetToMatrix, 16);
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
                    colorData.set(colorComponent.color, offset);
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
            }


            gl.clearColor(0.5, 0.5, 0.5, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

            gl.drawElementsInstanced(gl.TRIANGLES, Shape.cubeIndicies.length, gl.UNSIGNED_SHORT, 0, numInstances);
        }
    }

    render(entities: ReadonlyArray<Entity>): void
    {
        this.renderFunc(entities);
    }

    // Utility to complain loudly if we fail to find the uniform
    private getUniformLocation(program, name, webgl: WebGLRenderingContext): WebGLUniformLocation {
        var uniformLocation = webgl.getUniformLocation(program, name);
        if (uniformLocation === -1) {
            throw 'Can not find uniform ' + name + '.';
        }
        return uniformLocation;
    }

    private getAttribLocation(program, name, webgl: WebGLRenderingContext) {
        var attributeLocation = webgl.getAttribLocation(program, name);
        if (attributeLocation === -1) {
            throw 'Can not find attribute ' + name + '.';
        }
        return attributeLocation;
    }

    private compileShader(shaderType: GLenum, shaderSource: string, webgl: WebGLRenderingContext): WebGLShader
    {
        var shader = webgl.createShader(shaderType);
        webgl.shaderSource(shader, shaderSource);
        webgl.compileShader(shader);

        if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
            throw "Shader compile failed with: " + webgl.getShaderInfoLog(shader);
        }

        return shader;
    }
}