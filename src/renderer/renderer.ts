import { Entity } from "tick-knock";

export interface Renderer
{
    render(boxes: ReadonlyArray<Entity>, sun: Entity): void;
}
