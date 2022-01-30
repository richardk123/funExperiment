import {web} from "webpack";
import {Renderer} from "./renderer";
import {Star} from "./star";
import vertexShaderFile from '!!raw-loader!./shader/vertex.glsl';
import fragmentShaderFile from '!!raw-loader!./shader/fragment.glsl';

export class RendererGpu implements Renderer
{

    metaballsData: WebGLUniformLocation;
    metaballsCount: WebGLUniformLocation;
    webgl: WebGLRenderingContext;
    width: number;
    height: number;

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var webgl = canvas.getContext('webgl');

        var vertexShader = this.compileShader(webgl.VERTEX_SHADER , vertexShaderFile, webgl);
        var fragmentShader = this.compileShader(webgl.FRAGMENT_SHADER ,fragmentShaderFile, webgl);

        var program = webgl.createProgram();
        webgl.attachShader(program, vertexShader);
        webgl.attachShader(program, fragmentShader);
        webgl.linkProgram(program);
        webgl.useProgram(program);

        var vertexData = new Float32Array([
            -1.0,  1.0, // top left
            -1.0, -1.0, // bottom left
            1.0,  1.0, // top right
            1.0, -1.0, // bottom right
        ]);
        var vertexDataBuffer = webgl.createBuffer();
        webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexDataBuffer);
        webgl.bufferData(webgl.ARRAY_BUFFER, vertexData, webgl.STATIC_DRAW);

        // To make the geometry information available in the shader as attributes, we
        // need to tell WebGL what the layout of our data in the vertex buffer is.
        var positionHandle = this.getAttribLocation(program, 'position', webgl);
        webgl.enableVertexAttribArray(positionHandle);
        webgl.vertexAttribPointer(positionHandle,
            2, // position is a vec2
            webgl.FLOAT, // each component is a float
            false, // don't normalize values
            2 * 4, // two 4 byte float components per vertex
            0 // offset into each span of vertex data
        );

        this.metaballsData = this.getUniformLocation(program, 'metaballs', webgl);
        this.metaballsCount = this.getUniformLocation(program, 'metaballsCount', webgl);
        this.webgl = webgl;


        this.width = canvas.width;
        this.height = canvas.height;
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

    render(stars: Array<Star>): void
    {
        // To send the data to the GPU, we first need to
        // flatten our data into a single array.
        var dataToSendToGPU = new Float32Array(4 * stars.length);

        stars.forEach((star, index) =>
        {
            var baseIndex = 4 * index;
            dataToSendToGPU[baseIndex + 0] = star.position.x;
            dataToSendToGPU[baseIndex + 1] = star.position.y;
            dataToSendToGPU[baseIndex + 2] = star.radius;
            dataToSendToGPU[baseIndex + 3] = star.mass;
        });

        this.webgl.uniform4fv(this.metaballsData, dataToSendToGPU);
        this.webgl.uniform1i(this.metaballsCount, stars.length);

        this.webgl.drawArrays(this.webgl.TRIANGLE_STRIP, 0, 4);
    }
}