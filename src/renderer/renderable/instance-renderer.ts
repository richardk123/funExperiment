import { Entity } from "tick-knock";
import { Color } from "../../component/color";
import { WebglUtils } from "../webgl-utils";

export class InstanceRenderer
{

    readonly render: (program: WebGLProgram, instances: ReadonlyArray<Entity>, materials: ReadonlyArray<Entity>) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        const materialTexture = this.createMaterialTexture(gl, 1);
        
        this.render = (program, instances, materials) =>
        {
            gl.useProgram(program);

            this.storeMaterials(gl, program, 1, materials, materialTexture);
        }
    }

    createMaterialTexture(gl: WebGL2RenderingContext, textureIndex: number): WebGLTexture
    {
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }

    private storeMaterials(gl: WebGL2RenderingContext, program: WebGLProgram, textureIndex: number, materials: ReadonlyArray<Entity>, texture: WebGLTexture)
    {

        var textureLocation = WebglUtils.getUniformLocation(program, "materialsData", gl);
        
        const data = new Float32Array(materials.length * 16 * 4);

        materials.forEach((material, index) =>
        {
            const baseIndex = 16 * 4 * index;
            const color = material.get(Color);
            data[baseIndex + 0] = color.r;
            data[baseIndex + 1] = color.g;
            data[baseIndex + 2] = color.b;
            data[baseIndex + 3] = color.a;
        });

        // gl.pixelStorei(gl.UNPACK_ALIGNMENT, 8);
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 1, materials.length, 0, gl.RGBA, gl.FLOAT, data);
        gl.uniform1i(textureLocation, textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, texture);

    }
}