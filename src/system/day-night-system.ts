import {Entity, Query, System} from "tick-knock";
import {EntityTags} from "../entity/entity-tags";
import {Direction} from "../component/direction";
import * as GLM from "gl-matrix";

const sunQuery = new Query((entity: Entity) => {
    return entity.has(EntityTags.SUN);
});

export class DayNightSystem extends System
{
    angle = 0;

    constructor()
    {
        super();
    }

    public onAddedToEngine(): void
    {
        this.engine.addQuery(sunQuery);
    }

    public onRemovedFromEngine(): void
    {
        this.engine.removeQuery(sunQuery);
    }

    public update(dt: number): void
    {
        this.angle += dt / 100;

        const quat = GLM.quat.create();
        const axis = GLM.vec3.fromValues(0, 1, 0);
        const lightPosition = GLM.vec3.fromValues(0, 0, 1);

        GLM.quat.setAxisAngle(quat, axis, this.angle);
        GLM.vec3.transformQuat(lightPosition, lightPosition, quat);

        const sun = sunQuery.first;
        const directionComponent = sun.get(Direction);

        directionComponent.direction[0] = lightPosition[0];
        directionComponent.direction[1] = lightPosition[1];
        directionComponent.direction[2] = lightPosition[2];
    }
}