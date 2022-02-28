import { V3 } from "./base/v3";

export class Shape
{
    private readonly _type: ShapeType;

    constructor(public type: ShapeType,
                public radius?: number,
                public v1?: V3,
                public v2?: V3)
    {
        this._type = type;
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