import { V3 } from "./base/v3";

export class Shape
{
    private readonly _type: ShapeType;

    constructor(public type: ShapeType, public radius: number, public dimension: V3)
    {
        this._type = type;
    }

}


export enum ShapeType
{
    BOX,
    SPHERE,
}