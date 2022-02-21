export class Modifier
{
    public type: ModifierType;
    public smoothness = 0;

    constructor(type: ModifierType, smoothness?: number)
    {
        this.type = type;
        if (smoothness)
        {
            this.smoothness = smoothness;
        }
    }

}

export enum ModifierType
{
    EXACT,
    INTERSECTION,
    SMOOTH
}