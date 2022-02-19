
import { Entity, System } from "tick-knock";
import { QueryHolder } from "../common/query-holder";
import { RendererOpengl } from "../renderer/renderer-opengl";

export class RendererSystem extends System
{
    public constructor(public renderer: RendererOpengl)
    {
        super();
    }

    onAddedToEngine(): void 
    {
    }

    public update(): void 
    {
        const sun = QueryHolder.sunQuery.first;
        const camera = QueryHolder.cameraQuery.first;
        const instances = QueryHolder.instanceQuery.entities;
        const materials = QueryHolder.materialQuery.entities;

        this.renderer.render(sun, camera, instances, materials);
    }
}