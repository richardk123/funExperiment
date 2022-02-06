import { Renderer} from "./renderer";
import * as GLM from 'gl-matrix';
import vertexShaderFile from '!!raw-loader!./shader/vertex.glsl';
import fragmentShaderFile from '!!raw-loader!./shader/fragment.glsl';
import { Entity } from "tick-knock";
import {AmbientLightIntensity} from "../component/light/abmient-light-intensity";
import {SunlightIntensity} from "../component/light/sun-light-intensity";
import {Direction} from "../component/direction";
import { WebglUtils } from "./webgl-utils";
import { CubeRenderer } from "./cube-renderer";

export class RendererGpu implements Renderer
{
    gl: WebGL2RenderingContext;
    renderFunc: (entities: ReadonlyArray<Entity>, sun: Entity) => void;

    static MAX_NUMBER_OF_INSTANCES = Math.pow(20, 2);
    static SHADOW_MAP_SIZE = 2048;


    constructor()
    {
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var gl = canvas.getContext('webgl2');
        
        const program = WebglUtils.createShaderProgram(gl, vertexShaderFile, fragmentShaderFile);
        
        // uniforms
        const matViewUniformLocation = WebglUtils.getUniformLocation(program, 'mView', gl);
        const matProjUniformLocation = WebglUtils.getUniformLocation(program, 'mProj', gl);

        const ambientLightIntensityUniformLocation = WebglUtils.getUniformLocation(program, 'ambientLightIntensity', gl);
        const sunlightIntensityUniformLocation = WebglUtils.getUniformLocation(program, 'sunlightIntensity', gl);
        const sunlightDirectionLocation = WebglUtils.getUniformLocation(program, 'sunlightDirection', gl);

        const cubeRenderer = new CubeRenderer(gl, RendererGpu.MAX_NUMBER_OF_INSTANCES);

        gl.useProgram(program);

        // set global parameters
        this.gl = gl;

        // parameters
        const identityMatrix = new Float32Array(16);
        GLM.mat4.identity(identityMatrix);

        this.renderFunc = (cubes, sun) =>
        {
            // optimalizations
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.frontFace(gl.CCW);
            gl.cullFace(gl.BACK);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // lighting
            const ambientLightIntensity = sun.get(AmbientLightIntensity);
            const sunlightIntensity = sun.get(SunlightIntensity);
            const sunLightDirection = sun.get(Direction);

            gl.uniform3f(ambientLightIntensityUniformLocation, ambientLightIntensity.x, ambientLightIntensity.y, ambientLightIntensity.z);
            gl.uniform3f(sunlightIntensityUniformLocation, sunlightIntensity.x, sunlightIntensity.y, sunlightIntensity.z);
            gl.uniform3f(sunlightDirectionLocation, sunLightDirection.x, sunLightDirection.y, sunLightDirection.z);

            // view matrix
            var viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
            this.gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
            
            // projection matrix (prevede na -1 to 1 souradnice pro gpu)
            const aspectRation = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            var projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, GLM.glMatrix.toRadian(45), aspectRation, 0.1, 1000.0);
            this.gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

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