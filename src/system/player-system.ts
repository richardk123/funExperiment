import { Entity, System } from "tick-knock";
import { EntityTags } from "../common/entity-tags";
import { Position } from "../component/position";
import { Bezier, Point } from "bezier-js";
import { Head } from "../component/player/head";
import { Tail } from "../component/player/tail";
import { PartsCount } from "../component/player/parts-count";
import { Body } from "../component/player/body";
import { V3 } from "../component/base/v3";

export class PlayerSystem extends System
{
    onAddedToEngine(): void 
    {
        const player = new Entity();
        player.add(new Head(0, 1, 0));
        player.add(new Tail(3, 1, 0));
        player.add(new PartsCount(3));
        player.add(EntityTags.PLAYER);

        this.generatePoints(player);
        this.engine.addEntity(player);
    }

    update(dt: number): void 
    {

    }

    private generatePoints(player: Entity)
    {
        const head = player.get(Head);
        const tail = player.get(Tail);
        const partCount = player.get(PartsCount);

        const points = [head, {x: 2, y : 1, z: 0}, tail];
        const bezier = new Bezier(points);
        const bodyData = bezier.getLUT(partCount.count);

        const bodyDataV3 = new Array<V3>();
        bodyData.forEach(data =>
        {
            bodyDataV3.push(new V3(data.x, data.y, data.z));
        });
        player.add(new Body(bodyDataV3));
    }
}