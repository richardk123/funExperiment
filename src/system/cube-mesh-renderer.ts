import { Entity, Query, System } from "tick-knock";
import { Color } from "../component/color";
import { Position } from "../component/position";
import { Renderer } from "../renderer";
import { RendererGpu } from "../renderer-gpu";

const displayListQuery = new Query((entity: Entity) => {
    return entity.hasAll(Position);
});

export class CubeMeshRenderer extends System
{
    public constructor(public renderer: Renderer) 
    {
        super();
    }

    public update(): void 
    {
        const {entities} = this.engine;

        const staticCubes = entities.
            filter(entity => entity.hasAll(Position, Color))
            .map(entity => 
            {
              return {position : entity.get(Position), color: entity.get(Color)};
            });
            
        this.renderer.render(staticCubes);
    }
}