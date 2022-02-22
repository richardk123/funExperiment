import { Entity } from "tick-knock";
import { Color } from "../../component/color";
import { MaterialId } from "../../component/material-id";
import { Modifier } from "../../component/modifier";
import { Position } from "../../component/position";
import { Reflection } from "../../component/reflection";
import { Shape } from "../../component/shape";
import { WebglUtils } from "../webgl-utils";

export class InstanceRenderer
{
    readonly render: (program: WebGLProgram, instances: ReadonlyArray<Entity>, materials: ReadonlyArray<Entity>) => void;

    constructor(gl: WebGL2RenderingContext)
    {
        const materialTexture = this.createDataTexture(gl, 1);
        const instancesTexture = this.createDataTexture(gl, 2);
        
        this.render = (program, instances, materials) =>
        {
            gl.useProgram(program);

            const materialIdIndexMap = new Map<number, number>();
            materials.forEach((material, index) =>
            {
                const materialId = material.get(MaterialId);
                materialIdIndexMap.set(materialId.id, index);
            });

            this.storeMaterialData(gl, program, 1, materials, materialTexture);
            this.storeInstancesData(gl, program, 2, instances, instancesTexture, materialIdIndexMap);
        }
    }

    createDataTexture(gl: WebGL2RenderingContext, textureIndex: number): WebGLTexture
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

    private storeMaterialData(gl: WebGL2RenderingContext, program: WebGLProgram, textureIndex: number, materials: ReadonlyArray<Entity>, texture: WebGLTexture)
    {

        var textureLocation = WebglUtils.getUniformLocation(program, "materialsData", gl);
        
        const data = new Float32Array(materials.length * 4);

        materials.forEach((material, index) =>
        {
            const baseIndex = 4 * index;
            const color = material.get(Color);
            data[baseIndex + 0] = color.r;
            data[baseIndex + 1] = color.g;
            data[baseIndex + 2] = color.b;

            const reflection = material.get(Reflection);
            data[baseIndex + 3] = reflection.value;
        });

        // gl.pixelStorei(gl.UNPACK_ALIGNMENT, 8);
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 1, materials.length, 0, gl.RGBA, gl.FLOAT, data);
        gl.uniform1i(textureLocation, textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }

    private storeInstancesData(gl: WebGL2RenderingContext, program: WebGLProgram, textureIndex: number, instances: ReadonlyArray<Entity>, texture: WebGLTexture, materialIdIndexMap: Map<number, number>)
    {

        var textureLocation = WebglUtils.getUniformLocation(program, "instancesData", gl);
        
        const data = new Float32Array(instances.length * 12);

        instances.forEach((instance, index) =>
        {
            const baseIndex = 12 * index;

            const position = instance.get(Position);
            data[baseIndex + 0] = position.x;
            data[baseIndex + 1] = position.y;
            data[baseIndex + 2] = position.z;

            const materialId = instance.get(MaterialId);
            data[baseIndex + 3] = materialIdIndexMap.get(materialId.id);

            const modifier = instance.get(Modifier);
            data[baseIndex + 4] = modifier.type;
            data[baseIndex + 5] = modifier.smoothness;

            const shape = instance.get(Shape);
            data[baseIndex + 6] = shape.type;
            data[baseIndex + 7] = shape.radius;
            data[baseIndex + 8] = shape.dimension.x;
            data[baseIndex + 9] = shape.dimension.y;
            data[baseIndex + 10] = shape.dimension.z;
            data[baseIndex + 11] = 0;
        });

        // gl.pixelStorei(gl.UNPACK_ALIGNMENT, 8);
        gl.activeTexture(gl.TEXTURE0 + textureIndex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 3, instances.length, 0, gl.RGBA, gl.FLOAT, data);
        gl.uniform1i(textureLocation, textureIndex);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }
}