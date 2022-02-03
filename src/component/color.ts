export class Color
{
    public color = new Float32Array(4);

    constructor(r: number, g: number, b: number, a: number)
    {
        this.color[0] = r;
        this.color[1] = g;
        this.color[2] = b;
        this.color[3] = a;
    }
}