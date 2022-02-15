import metaVertexShaderFile from '!!raw-loader!./shader/meta-vertex.glsl';
import metaFragmentShaderFile from '!!raw-loader!./shader/meta-fragment.glsl';

import { Entity } from "tick-knock";
import { WebglUtils } from "./webgl-utils";
import { DirectionalLight } from "./renderable/directional-light";
import { Snake } from "./renderable/snake";

export class RendererOpengl
{
    renderFunc: (sun: Entity, cameraPerspective: Entity) => void;

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl2');

        const metaProgram = WebglUtils.createShaderProgram(gl, metaVertexShaderFile, metaFragmentShaderFile, "meta");
        
        // const skybox = new Skybox(gl);
        const directionalLight = new DirectionalLight(gl);
        const snake = new Snake(gl);

        this.renderFunc = (sun, cameraPerspective) =>
        {
            // optimalizations
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.frontFace(gl.CCW);
            gl.cullFace(gl.BACK);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // clear buffers and colors
            gl.clearColor(0, 0, 0, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

            // meta
            directionalLight.render(sun, metaProgram);
            snake.render(cameraPerspective, metaProgram);
            
        }
    }

    render(sun: Entity, cameraPerspective: Entity): void
    {
        this.renderFunc(sun, cameraPerspective);
    }
}