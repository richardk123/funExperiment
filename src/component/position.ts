import * as GLM from 'gl-matrix'

export class Position 
{
    public position = new Float32Array(3);

    constructor(x: number, y: number, z: number)
    {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
    }

}