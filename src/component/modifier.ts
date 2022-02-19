export class Modifier
{
    public type: ModifierType;
    private smoothness: number;

    constructor(type: ModifierType, smoothness?: number)
    {
        this.type = type;
        this.smoothness = smoothness;
    }

}

export enum ModifierType
{
    EXACT,
    INTERSECTION,
    SMOOTH
}