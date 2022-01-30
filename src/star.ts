import { Vector } from 'vector2d';
import { Utils } from './utils';

export class Star
{
    position: Vector;
    speed: Vector;
    mass: number;

    constructor(position: Vector, speed: Vector, mass: number)
    {
        this.position = position;
        this.speed = speed;
        this.mass = mass;
    }

    public get radius()
    {
        return this.mass * 5;
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

        const mass = Utils.randomFromInterval(0.1, 1);
        const star = new Star(new Vector(0, 0), new Vector(0, 0), mass);
        this.moveToEdgeAndSetSpeed(star);
        return star;
    }

    public moveToEdgeAndSetSpeed(star: Star)
    {
        const xFrozen = Utils.randomBool();
        let position = new Vector(0, 0);

        if (xFrozen)
        {
            const minOrMax = Utils.randomBool();
            position.x = minOrMax ? -this.edgeOffset : this.canvasWidth + this.edgeOffset;
            position.y = Math.trunc(Math.random() * this.canvasHeight);
        }
        else
        {
            const minOrMax = Utils.randomBool();
            position.x = Math.trunc(Math.random() * this.canvasWidth);
            position.y = minOrMax ? -this.edgeOffset : this.canvasHeight + this.edgeOffset;
        }

        const randomPosition = new Vector(this.canvasWidth * Math.random(), this.canvasHeight * Math.random());

        const speedMagnitude = Utils.randomFromInterval(0.1, 0.5);
        const speed = randomPosition.subtract(position).unit().mulS(speedMagnitude);

        star.position = position;
        star.speed = speed;
    }
}