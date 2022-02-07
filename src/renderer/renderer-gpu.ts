import { Renderer} from "./renderer";
import * as GLM from 'gl-matrix';
import vertexShaderFile from '!!raw-loader!./shader/vertex.glsl';
import fragmentShaderFile from '!!raw-loader!./shader/fragment.glsl';
import depthVertexShaderFile from '!!raw-loader!./shader/depth-vertex.glsl';
import depthFragmentShaderFile from '!!raw-loader!./shader/depth-fragment.glsl';

import { Entity } from "tick-knock";
import { WebglUtils } from "./webgl-utils";
import { PespectiveCamera } from "./renderable/perspective-camera";
import { CubeRenderer } from "./renderable/cube-renderer";
import { DirectionalLight } from "./renderable/directional-light";
import { OrtographicCamera } from "./renderable/ortographic-camera";

export class RendererGpu implements Renderer
{
    renderFunc: (entities: ReadonlyArray<Entity>, sun: Entity, cameraPerspective: Entity) => void;

    static MAX_NUMBER_OF_INSTANCES = Math.pow(20, 2);
    static SHADOW_MAP_SIZE = 2048;

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl2');
        
        const program = WebglUtils.createShaderProgram(gl, vertexShaderFile, fragmentShaderFile);
        
        const cubeRenderer = new CubeRenderer(gl, RendererGpu.MAX_NUMBER_OF_INSTANCES);
        const directionalLight = new DirectionalLight(gl);
        const perspectiveCamera = new PespectiveCamera(gl);
        
        const depthProgram = WebglUtils.createShaderProgram(gl, depthVertexShaderFile, depthFragmentShaderFile);
        const ortographicCamera = new OrtographicCamera(gl);


        this.renderFunc = (cubes, sun, cameraPerspective) =>
        {
            // optimalizations
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.frontFace(gl.CCW);
            gl.cullFace(gl.BACK);
            
            // clear buffers and colors
            gl.clearColor(0, 0, 0, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


            // standard
            gl.useProgram(program);
            directionalLight.render(sun, program);
            perspectiveCamera.render(cameraPerspective, program);
            cubeRenderer.render(cubes, program);

            // depth
            // gl.useProgram(depthProgram);
            // directionalLight.render(sun, depthProgram);
            // ortographicCamera.render(null, depthProgram);
            // cubeRenderer.render(cubes, depthProgram);

        }
    }

    render(boxes: ReadonlyArray<Entity>, sun: Entity, cameraPerspective: Entity): void
    {
        this.renderFunc(boxes, sun, cameraPerspective);
    }
}