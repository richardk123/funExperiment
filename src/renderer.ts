import { Color } from "./component/color";
import { Position } from "./component/position";
import { Rotation } from "./component/rotation";

export interface Renderer
{
    render(cubes: Cube[]): void;

    width: number;

    height: number;
}

export class Cube
{
    constructor(public position: Position, public color: Color, public rotation: Rotation)
    {

    }
}