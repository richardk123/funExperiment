
import { System } from "tick-knock";
import { QueryHolder } from "../query-holder";
import { Renderer } from "../renderer/renderer";

export class RendererSystem extends System
{
    public constructor(public renderer: Renderer)
    {
        super();
    }

    public update(): void 
    {
        const boxes = QueryHolder.boxQuery.entities;
        const sun = QueryHolder.sunQuery.first;
        const cameraPerspective = QueryHolder.cameraPerspectiveQuery.first;

        this.renderer.render(boxes, sun, cameraPerspective);
    }
}