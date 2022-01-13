import { Vector } from 'vector2d';

export class Star
{
    position: Vector;
    radius: number;
    speed: Vector;
    mass: number;

    constructor(position: Vector, radius: number, speed: Vector, mass: number)
    {
        this.position = position;
        this.radius = radius;
        this.speed = speed;
        this.mass = mass;
    }

    public distance(position: Vector): number
    {
        return this.position.distance(position);
    }
}

export class StarFactory
{

    canvasWidth: number;
    canvasHeight: number;
    edgeOffset: number;

    constructor(canvasWidth: number, canvasHeight: number, edgeOffset: number)
    {
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.edgeOffset = edgeOffset;
    }

    public createStarOnEdge(): Star
    {

        const star = new Star(new Vector(0, 0), 20, new Vector(0, 0), 1);
        this.moveToEdgeAndSetSpeed(star);
        return star;
    }

    public moveToEdgeAndSetSpeed(star: Star)
    {
        const xFrozen = this.randomBool();
        let position = new Vector(0, 0);

        if (xFrozen)
        {
            const minOrMax = this.randomBool();
            position.x = minOrMax ? -this.edgeOffset : this.canvasWidth + this.edgeOffset;
            position.y = Math.trunc(Math.random() * this.canvasHeight);
        }
        else
        {
            const minOrMax = this.randomBool();
            position.x = Math.trunc(Math.random() * this.canvasWidth);
            position.y = minOrMax ? -this.edgeOffset : this.canvasHeight + this.edgeOffset;
        }

        const randomPosition = new Vector(this.canvasWidth * Math.random(), this.canvasHeight * Math.random());
        const speed = randomPosition.subtract(position).unit().mulS(5);

        star.position = position;
        star.speed = speed;
    }

    private randomBool(): boolean
    {
        return Math.random() < 0.5;
    }
}