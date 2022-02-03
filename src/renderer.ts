import { Color } from "./component/color";
import { Position } from "./component/position";

export interface Renderer
{
    render(staticCubes: {position: Position, color: Color}[]): void;

    width: number;

    height: number;
}