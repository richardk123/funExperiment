export class SunlightIntensity
{
    public intensity = new Float32Array(3);

    constructor(x: number, y: number, z: number)
    {
        this.intensity[0] = x;
        this.intensity[1] = y;
        this.intensity[2] = z;
    }
}