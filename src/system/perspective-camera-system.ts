import { System } from "tick-knock";
import { QueryHolder } from "../query-holder";

export class PerspectiveCameraSystem extends System
{
    public constructor()
    {
        super();
    }

    onAddedToEngine(): void {
        
    }

    onRemovedFromEngine(): void {
        
    }

    public update(): void 
    {
        const camera = QueryHolder.cameraPerspectiveQuery.first;
    }
}