import { Entity } from "tick-knock";
import { Shape } from "../shape";
import { WebglUtils } from "../webgl-utils";
import * as GLM from 'gl-matrix';
import { PespectiveCamera } from "./perspective-camera";
import { EyePosition } from "../../component/camera/eye-pos";
import { LookAtPosition } from "../../component/camera/look-at";
import boxBack from './../../assets/skybox/Box_Back.jpg';
import boxFront from './../../assets/skybox/Box_Front.jpg';
import boxTop from './../../assets/skybox/Box_Top.jpg';
import boxBottom from './../../assets/skybox/Box_Bottom.jpg';
import boxLeft from './../../assets/skybox/Box_Left.jpg';
import boxRight from './../../assets/skybox/Box_Right.jpg';

export class Skybox
{
    readonly render: (camera: Entity, program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        // quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        // load textures
        const imageFiles = [
            {image: boxBottom, target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z },
            {image: boxTop, target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z },

            {image: boxFront, target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y },
            {image: boxBack, target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y },
            
            {image: boxLeft, target: gl.TEXTURE_CUBE_MAP_POSITIVE_X },
            {image: boxRight, target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X },
        ];

        imageFiles.forEach(imageData =>
        {
            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            // setup each face so it's immediately renderable
            gl.texImage2D(imageData.target, level, internalFormat, width, height, 0, format, type, null);

            // Asynchronously load an image
            const image = new Image();
            image.src = imageData.image;
            image.addEventListener('load', () => 
            {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(imageData.target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });

        this.render = (camera, program) =>
        {
            gl.useProgram(program);
            
            const eye = camera.get(EyePosition);
            const lookAt = camera.get(LookAtPosition);

            const positionAttribLocation = WebglUtils.getAttribLocation(program, 'vertPosition', gl);
            const skyboxLocation = WebglUtils.getUniformLocation(program, "u_skybox", gl);
            const viewDirectionProjectionInverseLocation = WebglUtils.getUniformLocation(program, "u_viewDirectionProjectionInverse", gl);

            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, Shape.quadSkybox, gl.STATIC_DRAW);
            
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
            
            // Compute the projection matrix
            var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const projMatrix = new Float32Array(16);
            GLM.mat4.perspective(projMatrix, PespectiveCamera.FOV, aspect, 1, 2000);

            // View matrix
            const viewMatrix = new Float32Array(16);
            GLM.mat4.lookAt(viewMatrix, eye.asArray, lookAt.asArray, [0, 1, 0]);

            GLM.mat4.invert(viewMatrix, viewMatrix);
            // We only care about direciton so remove the translation
            viewMatrix[12] = 0;
            viewMatrix[13] = 0;
            viewMatrix[14] = 0;

            GLM.mat4.multiply(projMatrix, projMatrix, viewMatrix);
            GLM.mat4.invert(projMatrix, projMatrix);

            // Set the uniforms
            gl.uniformMatrix4fv(viewDirectionProjectionInverseLocation, false, projMatrix);

            // Tell the shader to use texture unit 0 for u_skybox
            gl.uniform1i(skyboxLocation, 0);

            // let our quad pass the depth test at 1.0
            gl.depthFunc(gl.LEQUAL);

            // Draw the geometry.
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
}