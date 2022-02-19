import { V4 } from "./base/v4";

export class Color
{
    private data = new Float32Array(4);

    constructor(r: number, g: number, b: number, a: number)
    {
        this.data[0] = r;
        this.data[1] = g;
        this.data[2] = b;
        this.data[3] = a;
    }

    
    get r(): number
    {
        return this.data[0];
    }

    set r(r: number)
    {
        this.data[0] = r;
    }

    get g(): number
    {
        return this.data[1];
    }

    set g(g: number)
    {
        this.data[1] = g;
    }

    get b(): number
    {
        return this.data[2];
    }
    
    set b(b: number)
    {
        this.data[2] = b;
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

    set asArray(data: Float32Array)
    {
        if (data.length !== 4)
        {
            fail("wrong color size");
        }
        this.data = data;
    }
}