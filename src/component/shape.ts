import { V3 } from "./base/v3";

export class Shape
{
    private readonly _type: ShapeType;

    constructor(type: ShapeType, public radius: number, public dimension: V3)
    {
        this._type = type;
    }

    public get type(): ShapeType
    {
        return this._type;
    }
}


export enum ShapeType
{
    BOX,
    SPHERE,
}