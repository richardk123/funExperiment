import { Vector } from "vector2d";
import { Star, StarFactory } from "./star";
import { Utils } from "./utils";

export class Physics
{

    stars: Array<Star>;
    width: number;
    height: number;
    starFactory: StarFactory;
    readonly edgeOffset = 100;

    readonly numberOfStars = 200;
    readonly gravitationalConstant = 1000;
    readonly massStealSpeed = 1000;
    readonly massStealDistanceTreashold = 0;

    constructor(width: number, height: number)
    {
        this.width = width;
        this.height = height;
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
        this.spawnStars();
        this.splitStar();

    }

    private spawnStars()
    {
        if (this.stars.length < this.numberOfStars)
        {
            this.stars.push(this.starFactory.createStarOnEdge());
        }
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

                    let massToSteal = ((star.mass / otherStar.mass) / (distance * distance)) * this.massStealSpeed;

                    if (radiusDistance < this.massStealDistanceTreashold && massToSteal)
                    {

                        if (massToSteal > otherStar.mass)
                        {
                            massToSteal = otherStar.mass;
                            const index = this.stars.indexOf(otherStar);
                            this.stars.splice(index, 1);
                        }

                        // conservate momentum
                        const starMomentum = star.speed.clone().multiplyByScalar(star.mass);
                        const stealedMassMomentum = otherStar.speed.clone().multiplyByScalar(massToSteal);

                        // conservate mass
                        otherStar.mass -= massToSteal;
                        star.mass += massToSteal;

                        const resultSpeed = starMomentum.add(stealedMassMomentum).divideByScalar(star.mass);
                        star.speed.x = resultSpeed.x;
                        star.speed.y = resultSpeed.y;
                    }
                })
        });
    }

    private applyVelocity()
    {
        this.stars.forEach(star =>
            {
                // add speed
                star.position.add(star.speed);

                // exit the edge
                if (star.position.x > this.width + this.edgeOffset || star.position.x < -this.edgeOffset || 
                    star.position.y < -this.edgeOffset || star.position.y > this.height + this.edgeOffset)
                {
                    // star.position.x = this.width - star.position.x;
                    // star.position.y = this.height - star.position.y;

                    const index = this.stars.indexOf(star);
                    this.stars.splice(index, 1);
                }
            });
        //
        // const totalMomentum = this.stars.map(star => star.mass);
        // const val = Math.max(...totalMomentum);
        // document.getElementById("totalMomentum").innerHTML = val.toString();
    }

    private splitStar()
    {
        this.stars.forEach(star =>
        {
            if (star.mass > star.explosionFrameThreshold)
            {
                const index = this.stars.indexOf(star);
                this.stars.splice(index, 1);

                const numberOfStars = Utils.randomFromInterval(4, star.mass / 2);

                for (let i = 0; i < numberOfStars; i++)
                {
                    const explosionSpeed = Utils.randomFromInterval(1.3, 2.3) * star.mass;
                    const pos = new Vector(star.position.x, star.position.y);
                    const speed = new Vector(star.speed.x, star.speed.y);
                    const newMass = star.mass / Utils.randomFromInterval(3, star.mass / 2);
                    const newStar = new Star(pos, speed, newMass);
                    const explosionDirection = new Vector(1, 1).rotate(((Math.PI * 2) / Utils.randomFromInterval(2, star.mass / 2)) * i);
                    newStar.speed.add(explosionDirection.clone().unit().mulS(explosionSpeed));
                    newStar.position.add(explosionDirection.clone().unit().mulS(star.radius));
                    this.stars.push(newStar);
                }

            }
        });
    }
}