import { Entity, System } from "tick-knock";
import { EntityTags } from "../common/entity-tags";
import { Position } from "../component/position";

export class PlayerSystem extends System
{

    onAddedToEngine(): void 
    {
        const entity1 = new Entity();
        entity1.add(new Position(-1, 0, 0));
        entity1.add(EntityTags.PLAYER_SPHERE)
        this.engine.addEntity(entity1);

        const entity2 = new Entity();
        entity2.add(new Position(1, 0, 0));
        entity2.add(EntityTags.PLAYER_SPHERE)
        this.engine.addEntity(entity2);

        const entity3 = new Entity();
        entity3.add(new Position(3, 0, 0));
        entity3.add(EntityTags.PLAYER_SPHERE)
        this.engine.addEntity(entity3);
    }

    update(dt: number): void 
    {
        
    }
}