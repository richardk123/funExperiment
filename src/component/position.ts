import * as GLM from 'gl-matrix'

export class Position 
{
    public position = new Float32Array(3);

    constructor(public x: number, public y: number, public z: number)
    {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
    }

}