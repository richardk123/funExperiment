import { Entity, System } from "tick-knock";
import { Color } from "../component/color";
import { Position } from "../component/position";
import { Rotation } from "../component/rotation";
import { Scale } from "../component/scale";
import { EntityTags } from "../entity/entity-tags";
import { Utils } from "../utils";

export class MapSystem extends System
{
    onAddedToEngine(): void 
    {
        const size = 50;
        for (let x = 0; x < size; x++)
        {
            for (let y = 0; y < size; y++)
            {
                const entity = new Entity();
                entity.add(new Position(-(size / 2) + x, -(size / 2) + y , Utils.randomBool() ? 0.5 : 0));
                entity.add(new Color(0.5, 0.5 , 0.5, 1));
                entity.add(new Rotation(0, 0, 0, 0));
                entity.add(new Scale(1, 1, 0.5));
                entity.add(EntityTags.CUBE);
                this.engine.addEntity(entity);
            }
        }
    }

    update(dt: number): void 
    {
        
    }
}