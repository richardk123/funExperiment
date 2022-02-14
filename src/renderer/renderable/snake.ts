import { Entity } from "tick-knock";
import { Shape } from "../shape";
import { WebglUtils } from "../webgl-utils";
import { EyePosition } from "../../component/camera/eye-pos";
import { LookAtPosition } from "../../component/camera/look-at";
import { Body } from "../../component/player/body";

// skybox images
import boxBack from './../../assets/skybox/Box_Back.jpg';
import boxFront from './../../assets/skybox/Box_Front.jpg';
import boxTop from './../../assets/skybox/Box_Top.jpg';
import boxBottom from './../../assets/skybox/Box_Bottom.jpg';
import boxLeft from './../../assets/skybox/Box_Left.jpg';
import boxRight from './../../assets/skybox/Box_Right.jpg';

export class Snake
{
    readonly render: (camera: Entity, program: WebGLProgram, player: Entity) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        // quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        //skybox
        this.skybox(gl);

        this.render = (camera, program, player) =>
        {
            gl.useProgram(program);

            const positionAttribLocation = WebglUtils.getAttribLocation(program, 'vertPosition', gl);

            const camPosLocation = WebglUtils.getUniformLocation(program, 'camPos', gl);
            const camLookAtLocation = WebglUtils.getUniformLocation(program, 'camLookAt', gl);
            const playerSpheresLocation = WebglUtils.getUniformLocation(program, 'playerSpheres', gl);
            const playerSpheresCountLocation = WebglUtils.getUniformLocation(program, 'playerSpheresCount', gl);
            const skyboxLocation = WebglUtils.getUniformLocation(program, "u_skybox", gl);

            // Tell the shader to use texture unit 0 for u_skybox
            gl.uniform1i(skyboxLocation, 0);

            // position
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, Shape.quad, gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

            // player
            const bodyParts = player.get(Body);
            const playerData = new Float32Array(3 * bodyParts.bodyPositions.length);
            bodyParts.bodyPositions
                .forEach((position, index) =>
                {
                    const baseIndex = 3 * index;
                    playerData[baseIndex + 0] = position.x;
                    playerData[baseIndex + 1] = position.y;
                    playerData[baseIndex + 2] = position.z;
                });
                
            gl.uniform3fv(playerSpheresLocation, playerData);
            gl.uniform1i(playerSpheresCountLocation, bodyParts.bodyPositions.length);

            // View matrix
            const eye = camera.get(EyePosition);
            const lookAt = camera.get(LookAtPosition);

            gl.uniform3fv(camPosLocation, eye.asArray);
            gl.uniform3fv(camLookAtLocation, lookAt.asArray);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    private skybox(gl: WebGL2RenderingContext): void
    {
        // Create a texture.
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // load textures
        const imageFiles = [
            {image: boxTop, target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y },
            {image: boxBottom, target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y },

            {image: boxFront, target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z },
            {image: boxBack, target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z },
            
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
    }
}