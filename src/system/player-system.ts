import { Entity, System } from "tick-knock";
import { EntityTags } from "../common/entity-tags";
import { Position } from "../component/position";

export class PlayerSystem extends System
{
    Z = -1;

    onAddedToEngine(): void 
    {
        const entity1 = new Entity();
        entity1.add(new Position(-1, 1, 0));
        entity1.add(EntityTags.PLAYER_SPHERE)
        this.engine.addEntity(entity1);

        const entity2 = new Entity();
        entity2.add(new Position(0, 1, 0));
        entity2.add(EntityTags.PLAYER_SPHERE)
        this.engine.addEntity(entity2);

        const entity3 = new Entity();
        entity3.add(new Position(1, 1, 0));
        entity3.add(EntityTags.PLAYER_SPHERE)
        this.engine.addEntity(entity3);

        const entity4 = new Entity();
        entity4.add(new Position(2, 1, 0));
        entity4.add(EntityTags.PLAYER_SPHERE)
        this.engine.addEntity(entity4);
    }

    update(dt: number): void 
    {
        
    }
}