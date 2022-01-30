import {Star} from "./star";

export interface Renderer
{
    render(stars: Array<Star>): void;

    width: number;

    height: number;
}