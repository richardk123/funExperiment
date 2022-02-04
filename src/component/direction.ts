export class Direction
{
    public direction = new Float32Array(3);

    constructor(x: number, y: number, z: number)
    {
        this.direction[0] = x;
        this.direction[1] = y;
        this.direction[2] = z;
    }
}