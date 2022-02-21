import { Entity } from "tick-knock";
import { Shape } from "../shape";
import { WebglUtils } from "../webgl-utils";

export class FrameRenderer
{
    readonly render: (program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        // quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        this.render = (program) =>
        {
            gl.useProgram(program);

            const positionAttribLocation = WebglUtils.getAttribLocation(program, 'vertPosition', gl);

            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, Shape.quad, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
}