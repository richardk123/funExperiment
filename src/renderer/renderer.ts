import { Entity } from "tick-knock";

export interface Renderer
{
    render(boxes: ReadonlyArray<Entity>, sun: Entity, cameraPerspective: Entity, playerSpheres: ReadonlyArray<Entity>): void;
}
