import { System } from "tick-knock";
import { EyePosition } from "../component/camera/eye-pos";
import { QueryHolder } from "../query-holder";
import { DebugRenderer } from "../ui/debug-renderer";

export class DebugSystem extends System
{

    onAddedToEngine(): void 
    {
        const cameraPerspective = QueryHolder.cameraPerspectiveQuery.first;
        const cameraPos = cameraPerspective.get(EyePosition);
        new DebugRenderer().render("Camera position", cameraPos);
    }

    update(dt: number): void 
    {

    }
}