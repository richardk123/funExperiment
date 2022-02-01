import {Renderer} from "./renderer";
import * as GLM from 'gl-matrix'
import vertexShaderFile from '!!raw-loader!./shader/vertex.glsl';
import fragmentShaderFile from '!!raw-loader!./shader/fragment.glsl';
import { Shape } from "./shape";

export class RendererGpu implements Renderer
{
    gl: WebGLRenderingContext;
    width: number;
    height: number;
    renderFunc: () => void;

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl');
        
        // optimalizations
        gl.enable(gl.DEPTH_TEST);
        // gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        // gl.cullFace(gl.BACK);

        const ext = gl.getExtension('ANGLE_instanced_arrays');
        if (!ext) {
          alert('need ANGLE_instanced_arrays'); 
        }

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

        // attributes and uniforms
        let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        let colorAttribLocation = gl.getAttribLocation(program, 'color');
        let matWorldAttribLocation = gl.getAttribLocation(program, 'mWorld');
        
        let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

        // cube buffer
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, Shape.cross, gl.STATIC_DRAW);

        // make a typed array with one view per matrix
        const numInstances = 5;
        const matrixData = new Float32Array(numInstances * 16);
        const matrices = [];
        for (let i = 0; i < numInstances; ++i) 
        {
            const byteOffsetToMatrix = i * 16 * 4;
            const numFloatsForView = 16;
            matrices.push(new Float32Array(
                matrixData.buffer,
                byteOffsetToMatrix,
                numFloatsForView));
        }

        const matrixBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
        // just allocate the buffer
        gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);
    
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array([
                1, 0, 0, 1,  // red
                0, 1, 0, 1,  // green
                0, 0, 1, 1,  // blue
                1, 0, 1, 1,  // magenta
                0, 1, 1, 1,  // cyan
                ]),
            gl.STATIC_DRAW);

        gl.useProgram(program);
        
        // set global parameters
        this.gl = gl;
        this.width = canvas.width;
        this.height = canvas.height;

        // parameters
        const identityMatrix = new Float32Array(16);
        GLM.mat4.identity(identityMatrix);
        let angle = 0;

        this.renderFunc = () =>
        {
            angle = performance.now() / 1000 / 6 * 2 * Math.PI;

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // camera
            var viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
            this.gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
            
            // projection
            const aspectRation = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            var projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, GLM.glMatrix.toRadian(45), aspectRation, 0.1, 1000.0);
            this.gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

            // update all the matrices
            matrices.forEach((mat, index) => {
                GLM.mat4.fromTranslation(mat, [0, index, 0]);
            });

            // upload the new matrix data
            gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

            // set all 4 attributes for matrix
            const bytesPerMatrix = 4 * 16;
            for (let i = 0; i < 4; ++i) 
            {
                const loc = matWorldAttribLocation + i;
                gl.enableVertexAttribArray(loc);
                // note the stride and offset
                const offset = i * 16;  // 4 floats per row, 4 bytes per float
                gl.vertexAttribPointer(
                    loc,              // location
                    4,                // size (num values to pull from buffer per iteration)
                    gl.FLOAT,         // type of data in buffer
                    false,            // normalize
                    bytesPerMatrix,   // stride, num bytes to advance to get to next set of values
                    offset,           // offset in buffer
                );
                // this line says this attribute only changes for each 1 instance
                ext.vertexAttribDivisorANGLE(loc, 1);
            }

            // set attribute for color
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.enableVertexAttribArray(colorAttribLocation);
            gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
            // this line says this attribute only changes for each 1 instance
            ext.vertexAttribDivisorANGLE(colorAttribLocation, 1);

            gl.clearColor(0, 0, 0, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

            ext.drawArraysInstancedANGLE(
                gl.TRIANGLES,
                0,             // offset
                12,   // num vertices per instance
                numInstances,  // num instances
              );
        }
    }

    render(): void
    {
        this.renderFunc();
    }
    
    // Utility to complain loudly if we fail to find the uniform
    getUniformLocation(program, name, webgl: WebGLRenderingContext): WebGLUniformLocation {
        var uniformLocation = webgl.getUniformLocation(program, name);
        if (uniformLocation === -1) {
            throw 'Can not find uniform ' + name + '.';
        }
        return uniformLocation;
    }

    getAttribLocation(program, name, webgl: WebGLRenderingContext) {
        var attributeLocation = webgl.getAttribLocation(program, name);
        if (attributeLocation === -1) {
            throw 'Can not find attribute ' + name + '.';
        }
        return attributeLocation;
    }

    compileShader(shaderType: GLenum, shaderSource: string, webgl: WebGLRenderingContext): WebGLShader
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