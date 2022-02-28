import { V3 } from "./base/v3";

export class Shape
{
    constructor(public type: ShapeType,
                public radius?: number,
                public v1?: V3,
                public v2?: V3)
    {
        if (!radius)
        {
            this.radius = 1.0;
        }

        if (!v1)
        {
            this.v1 = new V3(1, 1, 1);
        }
        if (!v2)
        {
            this.v2 = new V3(1, 1, 1);
        }
    }

}


export enum ShapeType
{
    BOX,
    SPHERE,
    CAPSULE,
    PLANE,
    TORUS
}