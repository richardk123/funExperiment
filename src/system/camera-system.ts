import { Entity, System } from "tick-knock";
import { LookAtPosition } from "../component/camera/look-at";
import { ObjectType } from "../component/object-type";
import { QueryHolder } from "../common/query-holder";
import { Name } from "../component/name";
import { Position } from "../component/position";

export class CameraSystem extends System
{
    time = 0;
    public constructor()
    {
        super();
    }

    onAddedToEngine(): void 
    {
        const perspectiveCamera = new Entity()
        .add(new Name("Camera"))
        .add(new Position(0.5, 7.5, -10))
        .add(new LookAtPosition(0, 0, 0))
        .add(ObjectType.CAMERA);
    
        this.engine.addEntity(perspectiveCamera);
    }

    onRemovedFromEngine(): void 
    {
        
    }

    public update(dt: number): void 
    {
        this.time += dt;
        const camera = QueryHolder.cameraQuery.first;
        camera.get(Position).y = 5* Math.sin(this.time / 30);
    }
}