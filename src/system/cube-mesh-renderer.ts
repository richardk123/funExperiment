import { Entity, Query, System } from "tick-knock";
import { Position } from "../component/position";
import { Renderer } from "../renderer";

export class CubeMeshRenderer extends System
{
    public constructor(public renderer: Renderer) 
    {
        super();
    }

    public update(): void 
    {
        const {entities} = this.engine;
        this.renderer.render(this.engine.entities);
    }
}