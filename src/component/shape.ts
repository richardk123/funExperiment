import { V3 } from "./base/v3";
import { Position } from "./position";

export abstract class Shape
{
    private readonly _type: ShapeType;
    protected radius: number;
    protected dimension: V3;

    constructor(type: ShapeType)
    {
        this._type = type;
    }

    public get type(): ShapeType
    {
        return this._type;
    }

    public asShape(): Shape
    {
        return this;
    }
}

export class ShapeCube extends Shape
{
    constructor(dimension: V3)
    {
        super(ShapeType.BOX);
        this.dimension = dimension;
    }
}

export class ShapeSphere extends Shape
{
    constructor(public radius: number)
    {
        super(ShapeType.SPHERE);
        this.radius = radius;
    }
}

export enum ShapeType
{
    BOX,
    SPHERE,
}