export class Direction
{
    public direction = new Float32Array(3);

    constructor(x: number, y: number, z: number)
    {
        this.direction[0] = x;
        this.direction[1] = y;
        this.direction[2] = z;
    }

    get x(): number
    {
        return this.direction[0];
    }

    get y(): number
    {
        return this.direction[1];
    }

    get z(): number
    {
        return this.direction[2];
    }
}