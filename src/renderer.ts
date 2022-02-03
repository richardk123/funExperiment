import { Position } from "./component/position";

export interface Renderer
{
    render(positions: Position[]): void;

    width: number;

    height: number;
}