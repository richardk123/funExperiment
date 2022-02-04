import { Entity, Query, System } from "tick-knock";
import { Renderer } from "../renderer";
import {EntityTags} from "../entity/entity-tags";

const boxQuery = new Query((entity: Entity) => {
    return entity.has(EntityTags.CUBE);
});

const sunQuery = new Query((entity: Entity) => {
    return entity.has(EntityTags.SUN);
});

export class RendererSystem extends System
{
    public constructor(public renderer: Renderer)
    {
        super();
    }

    public onAddedToEngine(): void
    {
        this.engine.addQuery(boxQuery);
        this.engine.addQuery(sunQuery);
    }

    public onRemovedFromEngine(): void
    {
        this.engine.removeQuery(boxQuery);
        this.engine.removeQuery(sunQuery);
    }

    public update(): void 
    {
        const boxes = boxQuery.entities;
        const sun = sunQuery.first;
        this.renderer.render(boxes, sun);
    }
}