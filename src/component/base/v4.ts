export class V4
{
    private data = new Float32Array(4);

    constructor(x: number, y: number, z: number, a: number)
    {
        this.data[0] = x;
        this.data[1] = y;
        this.data[2] = z;
        this.data[3] = a;
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

    get a(): number
    {
        return this.data[3];
    }
    
    set a(a: number)
    {
        this.data[3] = a;
    }

    get asArray()
    {
        return this.data;
    }

    set setAsArray(data: Float32Array)
    {
        this.data = data;
    }
}