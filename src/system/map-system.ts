import { Entity, System } from "tick-knock";
import { Color } from "../component/color";
import { Position } from "../component/position";
import { Rotation } from "../component/rotation";
import { Scale } from "../component/scale";
import { EntityTags } from "../common/entity-tags";

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
                entity.add(new Position(-(size / 2) + x, -(size / 2) + y , Math.random() < 0.1 ? 0.1 : 0));
                // entity.add(new Color(Math.random(), Math.random() , Math.random(), 1));
                entity.add(new Color(this.randomColor(0.5), this.randomColor(0.5) , this.randomColor(0.5), 1));
                entity.add(new Rotation(0, 0, 0, 0));
                entity.add(new Scale(1, 1, 0.1));
                entity.add(EntityTags.CUBE);
                this.engine.addEntity(entity);
            }
        }
    }

    private randomColor(color: number): number
    {
        return color + Math.random() * 0.3;
    }

    update(dt: number): void 
    {
        
    }
}