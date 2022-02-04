export class AmbientLightIntensity
{
    public intensity = new Float32Array(3);

    constructor(x: number, y: number, z: number)
    {
        this.intensity[0] = x;
        this.intensity[1] = y;
        this.intensity[2] = z;
    }

    get x(): number
    {
        return this.intensity[0];
    }

    get y(): number
    {
        return this.intensity[1];
    }

    get z(): number
    {
        return this.intensity[2];
    }
}