import {Entity, Query, System} from "tick-knock";
import {EntityTags} from "../entity/entity-tags";
import {Direction} from "../component/direction";
import * as GLM from "gl-matrix";
import { AmbientLightIntensity } from "../component/light/abmient-light-intensity";
import { SunlightIntensity } from "../component/light/sun-light-intensity";
import { QueryHolder } from "../query-holder";

export class DayNightSystem extends System
{
    angle = 0;

    constructor()
    {
        super();
    }

    public onAddedToEngine(): void
    {

        const sun = new Entity()
            .add(new AmbientLightIntensity(0.0, 0.0, 0.0))
            .add(new SunlightIntensity(0.4, 0.4, 0.4))
            .add(new Direction(10.0, 10.0, 2.0))
            .add(EntityTags.SUN);
    
        this.engine.addEntity(sun);
    }

    public update(dt: number): void
    {
        this.angle += dt / 100;

        const quat = GLM.quat.create();
        const axis = GLM.vec3.fromValues(0, 1, 0);
        const lightPosition = GLM.vec3.fromValues(0, 0, 1);

        GLM.quat.setAxisAngle(quat, axis, this.angle);
        GLM.vec3.transformQuat(lightPosition, lightPosition, quat);

        const sun = QueryHolder.sunQuery.first;
        const directionComponent = sun.get(Direction);

        directionComponent.x = lightPosition[0];
        directionComponent.y = lightPosition[1];
        directionComponent.z = lightPosition[2];
    }
}