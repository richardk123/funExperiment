import { Entity, Query, System } from "tick-knock";
import { Position } from "../component/position";
import { RendererGpu } from "../renderer-gpu";

const displayListQuery = new Query((entity: Entity) => {
    return entity.hasAll(Position);
});

export class CubeMeshRenderer extends System
{
    public constructor(public renderer: RendererGpu) 
    {
        super();
    }

    public update(dt: number): void {
        const {entities} = this.engine;

        const positions = entities.filter(entity => entity.hasAll(Position)).map(entity => entity.get(Position));
        this.renderer.render(positions);
    }
}