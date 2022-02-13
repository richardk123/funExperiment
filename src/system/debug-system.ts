import { System } from "tick-knock";
import { EyePosition } from "../component/camera/eye-pos";
import { LookAtPosition } from "../component/camera/look-at";
import { QueryHolder } from "../common/query-holder";
import { DebugRenderer } from "../ui/debug-renderer";
import { HeadAngle } from "../component/player/head-angle";

export class DebugSystem extends System
{

    onAddedToEngine(): void 
    {
        const cameraPerspective = QueryHolder.cameraPerspectiveQuery.first;
        const cameraPos = cameraPerspective.get(EyePosition);
        const cameraLookAt = cameraPerspective.get(LookAtPosition);

        const headAngle = QueryHolder.playerQuery.first.get(HeadAngle);

        DebugRenderer.renderCameraStats(cameraPos, cameraLookAt, headAngle);
    }

    update(dt: number): void 
    {
        const fps = (1000 / dt).toFixed(0);
        DebugRenderer.renderFps(fps);
    }
}