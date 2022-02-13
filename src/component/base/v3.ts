export class V3
{
    private data = new Float32Array(3);

    constructor(x: number, y: number, z: number)
    {
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
    }

    get x(): number
    {
        return this.data[0];
    }

    set x(x: number)
    {
        this.data[0] = x;
    }

    get y(): number
    {
        return this.data[1];
    }

    set y(y: number)
    {
        this.data[1] = y;
    }

    get z(): number
    {
        return this.data[2];
    }
    
    set z(z: number)
    {
        this.data[2] = z;
    }

    get asArray()
    {
        return this.data;
    }

    set asArray(data: Float32Array)
    {
        this.data = data;
    }
}