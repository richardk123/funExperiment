import { Vector } from "vector2d";
import { Star, StarFactory } from "./star";
import { Utils } from "./utils";

export class Physics
{

    stars: Array<Star>;
    width: number;
    height: number;
    starFactory: StarFactory;
    edgeOffset: number;

    readonly numberOfStars = 20;
    readonly gravitationalConstant = 1000;
    readonly massStealSpeed = 500;
    readonly massStealDistanceTreashold = 0;
    readonly maxGravityAcceleration = 1;

    constructor(width: number, height: number)
    {
        this.width = width;
        this.height = height;
        this.edgeOffset = 0;
        this.starFactory = new StarFactory(width, height, this.edgeOffset);

        this.stars = new Array<Star>();
        for (let i = 0; i < this.numberOfStars; i++)
        {
            this.stars.push(this.starFactory.createStarOnEdge());
        }
    }

    public simulate()
    {
        this.stealMass();
        this.applyGravity();
        this.applyVelocity();
    }

    private applyGravity()
    {
        this.stars.forEach(star =>
        {
            const accelerationVector = this.stars
                .filter(otherStar => otherStar !== star)
                .map(otherStar =>
                {
                    const distance = otherStar.position.distance(star.position);
                    const force = this.gravitationalConstant * ((star.mass * otherStar.mass) / (distance * distance));
                    return otherStar.position.clone().subtract(star.position).unit().multiplyByScalar(force / star.mass);
                })
                .reduce((acc, cur) => acc.add(cur), new Vector(0, 0));

            if (accelerationVector.magnitude() > this.maxGravityAcceleration)
            {
                accelerationVector.unit().multiplyByScalar(this.maxGravityAcceleration);
            }
            star.speed.add(accelerationVector);
        })
    }

    private stealMass()
    {
        this.stars.forEach(star =>
        {
            this.stars
                .filter(otherStar => otherStar !== star)
                .forEach(otherStar =>
                {
                    const distance = otherStar.position.distance(star.position);
                    const radiusDistance = distance - star.radius - otherStar.radius;
                   
                    if (radiusDistance < this.massStealDistanceTreashold)
                    {
                        let massToSteal = ((star.mass / otherStar.mass) / (distance * distance)) * this.massStealSpeed;

                        if (massToSteal > otherStar.mass)
                        {
                            massToSteal = otherStar.mass;
                            const index = this.stars.indexOf(otherStar);
                            this.stars.splice(index, 1);
                        }

                        // conservate momentum
                        const starMomentum = star.speed.clone().multiplyByScalar(star.mass);
                        const stealedMassMomentum = otherStar.speed.clone().multiplyByScalar(massToSteal);

                        const resultSpeed = starMomentum.add(stealedMassMomentum).divideByScalar(star.mass);
                        star.speed.x = resultSpeed.x;
                        star.speed.y = resultSpeed.y;

                        // conservate mass
                        otherStar.mass -= massToSteal;
                        star.mass += massToSteal;
                    }
                })
        });
    }

    private applyVelocity()
    {
        this.stars.forEach(star =>
            {
                if (star.position.x > this.width + this.edgeOffset || star.position.x < -this.edgeOffset || 
                    star.position.y < -this.edgeOffset || star.position.y > this.height + this.edgeOffset)
                {
                    this.starFactory.moveToEdgeAndSetSpeed(star);
                }
                star.position.add(star.speed);
            });
    }
}