import { Entity, System } from "tick-knock";
import { EyePosition } from "../component/camera/eye-pos";
import { LookAtPosition } from "../component/camera/look-at";
import { ObjectType } from "../component/object-type";
import { QueryHolder } from "../common/query-holder";

export class PerspectiveCameraSystem extends System
{
    public constructor()
    {
        super();
    }

    onAddedToEngine(): void 
    {
        const perspectiveCamera = new Entity()
        .add(new EyePosition(0.5, 7.5, -10))
        .add(new LookAtPosition(0, 0, 0))
        .add(ObjectType.CAMERA);
    
        this.engine.addEntity(perspectiveCamera);
    }

    onRemovedFromEngine(): void 
    {
        
    }

    public update(): void 
    {
        const camera = QueryHolder.cameraQuery.first;
    }
}