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

export class PlayerSystem extends System
{
    private _player: Entity;
    onAddedToEngine(): void 
    {
        this._player = new Entity();
        this._player.add(new Head(0, 1, 0));
        this._player.add(new Tail(4, 1, 0));
        this._player.add(new PartsCount(8));
        this._player.add(new HeadAngle(0));
        this._player.add(EntityTags.PLAYER);

        this.generatePoints(this._player);
        this.engine.addEntity(this._player);
    }

    update(dt: number): void 
    {
        this.generatePoints(this._player);
    }

    private generatePoints(player: Entity)
    {
        const head = player.get(Head);
        const tail = player.get(Tail);
        const partCount = player.get(PartsCount);

        const belzierPoint = this.rotateBelzierPoint(player);

        const points = [head, belzierPoint, tail];
        const bezier = new Bezier(points);
        const bodyData = bezier.getLUT(partCount.count);

        const bodyDataV3 = new Array<V3>();
        bodyData.forEach(data =>
        {
            bodyDataV3.push(new V3(data.x, data.y, data.z));
        });
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

        pointToCurve.x = head.x - pointToCurve.x;
        pointToCurve.z = head.z - pointToCurve.z;
        pointToCurve.y = 1;

        return pointToCurve;
    }
}