import { Vector } from 'vector2d';

export class Star
{
    position: Vector;
    radius: number;

    constructor(position: Vector, radius: number)
    {
        this.position = position;
        this.radius = radius;
    }

    public distance(position: Vector): number
    {
        return this.position.distance(position);
    }
}