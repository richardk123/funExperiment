import { Entity, System } from "tick-knock";
import { EntityTags } from "../common/entity-tags";
import { Position } from "../component/position";
import { Bezier, Point } from "bezier-js";
import { Head } from "../component/player/head";
import { Tail } from "../component/player/tail";
import { PartsCount } from "../component/player/parts-count";
import { Body } from "../component/player/body";
import { V3 } from "../component/base/v3";
import * as GLM from "gl-matrix";
import { HeadAngle } from "../component/player/head-angle";

const DEFAULT_Y = 0.3;
const DEFAULT_PART_SIZE = 0.5;
const MOVE_SPEED = 0.03;
export class PlayerSystem extends System
{
    private _time = 0;

    private _player: Entity;
    onAddedToEngine(): void 
    {
        this._player = new Entity();
        this._player.add(new Head(0, DEFAULT_Y, 0));
        this._player.add(new Tail(4, DEFAULT_Y, 0));
        this._player.add(new PartsCount(8));
        this._player.add(new HeadAngle(0));
        this._player.add(EntityTags.PLAYER);

        this.generatePoints(this._player, 1);
        this.engine.addEntity(this._player);
    }

    update(dt: number): void 
    {
        this._time += MOVE_SPEED; // move speed
        this.generatePoints(this._player, dt);
    }

    private generatePoints(player: Entity, dt: number)
    {
        const head = player.get(Head);
        const tail = player.get(Tail);
        const partCount = player.get(PartsCount);

        const belzierPoint = this.rotateBelzierPoint(player);

        const points = [head, belzierPoint, tail];
        const bezier = new Bezier(points);
        let bodyData = bezier.getLUT(partCount.count);

        const bodyDataV3 = new Array<V3>();
        bodyData.forEach((data, index) =>
        {
            bodyDataV3.push(new V3(data.x, data.y, data.z));
        });
        
        const dataSize = bodyData.length;
        for (let i = 0; i < dataSize - 1; i++)
        {
            const offset = Math.sin((this._time + (i * (Math.PI / 8 / dataSize))) * 2);
            const first = bodyDataV3[i];
            const second = bodyDataV3[i + 1];

            const direction = GLM.vec3.create();
            const speed = (offset / 10) * (dt / 2);
            if (offset > 0)
            {
                GLM.vec3.subtract(direction, first.asArray, second.asArray);
                GLM.vec3.normalize(direction, direction);
                GLM.vec3.scale(direction, direction, speed);
                GLM.vec3.add(first.asArray, first.asArray, direction);
            }
            else
            {
                GLM.vec3.subtract(direction, second.asArray, first.asArray);
                GLM.vec3.normalize(direction, direction);
                GLM.vec3.scale(direction, direction, speed);
                GLM.vec3.add(second.asArray, second.asArray, direction);
            }
        }

        const lastBodyPart = bodyDataV3[bodyDataV3.length - 1].asArray;
        const firstBodyPart = bodyDataV3[0].asArray;
        head.asArray = firstBodyPart;
        tail.asArray = lastBodyPart;

        player.add(new Body(bodyDataV3));
    }

    private rotateBelzierPoint(player: Entity): V3
    {
        const head = player.get(Head);
        const angle = player.get(HeadAngle).value;

        const quat = GLM.quat.create();
        const axis = GLM.vec3.fromValues(0, 1, 0);

        const pointToCurve = new V3(2, 0, 0);
        GLM.quat.setAxisAngle(quat, axis, angle * (Math.PI / 180));
        GLM.vec3.transformQuat(pointToCurve.asArray, pointToCurve.asArray, quat);

        pointToCurve.x = head.x + pointToCurve.x;
        pointToCurve.z = head.z + pointToCurve.z;
        pointToCurve.y = DEFAULT_Y;

        return pointToCurve;
    }
}