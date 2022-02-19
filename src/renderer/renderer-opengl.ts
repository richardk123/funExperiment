import metaVertexShaderFile from '!!raw-loader!./shader/meta-vertex.glsl';
import metaFragmentShaderFile from '!!raw-loader!./shader/meta-fragment.glsl';

import { Entity } from "tick-knock";
import { WebglUtils } from "./webgl-utils";
import { FrameRenderer } from "./renderable/frame-renderer";
import { SkyboxRenderer } from './renderable/skybox-renderer';
import { CameraRenderer } from './renderable/camera-renderer';
import { InstanceRenderer } from './renderable/instance-renderer';

export class RendererOpengl
{
    renderFunc: (sun: Entity, cameraPerspective: Entity, instances: ReadonlyArray<Entity>, materials: ReadonlyArray<Entity>) => void;

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl2');

        const metaProgram = WebglUtils.createShaderProgram(gl, metaVertexShaderFile, metaFragmentShaderFile, "meta");
        
        // const skybox = new Skybox(gl);
        const frameRenderer = new FrameRenderer(gl);
        const skyboxRenderer = new SkyboxRenderer(gl);
        const cameraRenderer = new CameraRenderer(gl);
        const instancesRenderer = new InstanceRenderer(gl);

        this.renderFunc = (sun, camera, instances, materials) =>
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
            frameRenderer.render(metaProgram);
            skyboxRenderer.render(metaProgram);
            cameraRenderer.render(camera, metaProgram);
            instancesRenderer.render(metaProgram, instances, materials);
        }
    }

    render(sun: Entity, cameraPerspective: Entity, instances: ReadonlyArray<Entity>, materials: ReadonlyArray<Entity>): void
    {
        this.renderFunc(sun, cameraPerspective, instances, materials);
    }
}