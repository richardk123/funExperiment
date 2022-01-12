import { Vector } from "vector2d";
import { Star, StarFactory } from "./star";

export class Physics
{

    stars: Array<Star>;
    width: number;
    height: number;
    starFactory: StarFactory;
    edgeOffset: number;

    constructor(width: number, height: number)
    {
        this.width = width;
        this.height = height;
        this.edgeOffset = 200;
        this.starFactory = new StarFactory(width, height, this.edgeOffset);

        const star1 = this.starFactory.createStarOnEdge();
        const star2 = this.starFactory.createStarOnEdge();
        const star3 = this.starFactory.createStarOnEdge();
        const star4 = this.starFactory.createStarOnEdge();

        this.stars = [star1, star2, star3, star4];
    }

    public simulate()
    {
        this.stars.forEach(star =>
        {
            if (star.position.x > this.width + this.edgeOffset || star.position.x < -this.edgeOffset || 
                star.position.y < -this.edgeOffset || star.position.y > this.height + this.edgeOffset)
            {
                this.starFactory.moveToEdgeAndSetSpeed(star);
            }

            star.position.x += star.speed.x;
            star.position.y += star.speed.y;
        });
    }
}