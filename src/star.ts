import { Vector } from 'vector2d';

export class Star
{
    position: Vector;
    radius: number;
    speed: Vector;

    constructor(position: Vector, radius: number, speed: Vector)
    {
        this.position = position;
        this.radius = radius;
        this.speed = speed;
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

    constructor(canvasWidth: number, canvasHeight: number)
    {
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
    }

    public createStarOnEdge(): Star
    {

        const star = new Star(new Vector(0, 0), 20, new Vector(0, 0));
        this.moveToEdgeAndSetSpeed(star);
        return star;
    }

    public moveToEdgeAndSetSpeed(star: Star)
    {
        const xFrozen = this.randomBool();
        let position = new Vector(0, 0);;

        if (xFrozen)
        {
            const minOrMax = this.randomBool();
            position.x = minOrMax ? 0 : this.canvasWidth;
            position.y = Math.trunc(Math.random() * this.canvasHeight);
        }
        else
        {
            const minOrMax = this.randomBool();
            position.x = Math.trunc(Math.random() * this.canvasWidth);
            position.y = minOrMax ? 0 : this.canvasHeight;
        }

        const randomPosition = new Vector(this.canvasWidth * Math.random(), this.canvasHeight * Math.random());
        const speed = randomPosition.subtract(position).unit().mulS(5);

        star.position = position.subtract(speed.clone().unit().multiplyByScalar(star.radius));
        star.speed = speed;
    }

    private randomBool(): boolean
    {
        return Math.random() < 0.5;
    }
}