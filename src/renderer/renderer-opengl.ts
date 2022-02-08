import { Renderer} from "./renderer";

import vertexShaderFile from '!!raw-loader!./shader/vertex.glsl';
import fragmentShaderFile from '!!raw-loader!./shader/fragment.glsl';

import depthVertexShaderFile from '!!raw-loader!./shader/depth-vertex.glsl';
import depthFragmentShaderFile from '!!raw-loader!./shader/depth-fragment.glsl';

import skyboxVertexShaderFile from '!!raw-loader!./shader/skybox-vertex.glsl';
import skyboxFragmentShaderFile from '!!raw-loader!./shader/skybox-fragment.glsl';

import metaVertexShaderFile from '!!raw-loader!./shader/meta-vertex.glsl';
import metaFragmentShaderFile from '!!raw-loader!./shader/meta-fragment.glsl';

import { Entity } from "tick-knock";
import { WebglUtils } from "./webgl-utils";
import { PespectiveCamera } from "./renderable/perspective-camera";
import { Cube } from "./renderable/cube";
import { DirectionalLight } from "./renderable/directional-light";
import { OrtographicCamera } from "./renderable/ortographic-camera";
import { Skybox } from "./renderable/skybox";
import { Snake } from "./renderable/snake";

export class RendererOpengl implements Renderer
{
    renderFunc: (entities: ReadonlyArray<Entity>, sun: Entity, cameraPerspective: Entity) => void;

    static MAX_NUMBER_OF_BOX_INSTANCES = Math.pow(100, 2);
    static SHADOW_MAP_SIZE = 2048;

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl2');
        
        const program = WebglUtils.createShaderProgram(gl, vertexShaderFile, fragmentShaderFile, "main");
        const depthProgram = WebglUtils.createShaderProgram(gl, depthVertexShaderFile, depthFragmentShaderFile, "depth");
        const skyboxProgram = WebglUtils.createShaderProgram(gl, skyboxVertexShaderFile, skyboxFragmentShaderFile, "skybox");
        const metaProgram = WebglUtils.createShaderProgram(gl, metaVertexShaderFile, metaFragmentShaderFile, "meta");
        
        const skybox = new Skybox(gl);
        const cubeRenderer = new Cube(gl, RendererOpengl.MAX_NUMBER_OF_BOX_INSTANCES);
        const directionalLight = new DirectionalLight(gl);
        const perspectiveCamera = new PespectiveCamera(gl);
        const snake = new Snake(gl);

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
            skybox.render(cameraPerspective, skyboxProgram);
            directionalLight.render(sun, program);
            perspectiveCamera.render(cameraPerspective, program);
            cubeRenderer.render(cubes, program);
            snake.render(cameraPerspective, metaProgram);

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