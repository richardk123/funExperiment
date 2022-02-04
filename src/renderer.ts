import { Entity } from "tick-knock";
import { Color } from "./component/color";
import { Position } from "./component/position";
import { Rotation } from "./component/rotation";

export interface Renderer
{
    render(boxes: ReadonlyArray<Entity>, sun: Entity): void;

    width: number;

    height: number;
}
