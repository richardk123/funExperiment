import { Renderer} from "./renderer";
import * as GLM from 'gl-matrix';
import vertexShaderFile from '!!raw-loader!./shader/vertex.glsl';
import fragmentShaderFile from '!!raw-loader!./shader/fragment.glsl';
import { Entity } from "tick-knock";
import { WebglUtils } from "./webgl-utils";
import { Camera } from "./renderable/camera";
import { CubeRenderer } from "./renderable/cube-renderer";
import { DirectionalLight } from "./renderable/directional-light";

export class RendererGpu implements Renderer
{
    renderFunc: (entities: ReadonlyArray<Entity>, sun: Entity) => void;

    static MAX_NUMBER_OF_INSTANCES = Math.pow(20, 2);
    static SHADOW_MAP_SIZE = 2048;

    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl2');
        
        const program = WebglUtils.createShaderProgram(gl, vertexShaderFile, fragmentShaderFile);
        
        const cubeRenderer = new CubeRenderer(gl, RendererGpu.MAX_NUMBER_OF_INSTANCES);
        const directionalLight = new DirectionalLight(gl, program);
        const camera = new Camera(gl, program);

        gl.useProgram(program);

        this.renderFunc = (cubes, sun) =>
        {
            // optimalizations
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.frontFace(gl.CCW);
            gl.cullFace(gl.BACK);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            directionalLight.render(sun);

            //TODO: parametrize
            camera.render(null);


            gl.clearColor(0, 0, 0, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

            cubeRenderer.renderCubes(cubes, program);
        }
    }

    render(boxes: ReadonlyArray<Entity>, sun: Entity): void
    {
        this.renderFunc(boxes, sun);
    }
}