import { WebglUtils } from "../webgl-utils";
import boxBack from './../../assets/skybox/Box_Back.jpg';
import boxFront from './../../assets/skybox/Box_Front.jpg';
import boxTop from './../../assets/skybox/Box_Top.jpg';
import boxBottom from './../../assets/skybox/Box_Bottom.jpg';
import boxLeft from './../../assets/skybox/Box_Left.jpg';
import boxRight from './../../assets/skybox/Box_Right.jpg';

export class SkyboxRenderer
{
    readonly render: (program: WebGLProgram) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        // quad
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        //skybox
        this.skybox(gl);

        this.render = (program) =>
        {
            gl.useProgram(program);

            const skyboxLocation = WebglUtils.getUniformLocation(program, "u_skybox", gl);

            // Tell the shader to use texture unit 0 for u_skybox
            gl.uniform1i(skyboxLocation, 0);
        }
    }

    private skybox(gl: WebGL2RenderingContext): void
    {
        // Create a texture.
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

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