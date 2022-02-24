import { System } from "tick-knock";
import { QueryHolder } from "../common/query-holder";
import { DebugRenderer } from "../ui/debug-renderer";

export class DebugSystem extends System
{
    private debugRenderer = new DebugRenderer();

    onAddedToEngine(): void 
    {
        const instances = QueryHolder.instanceQuery.entities;
        const cameras = QueryHolder.cameraQuery.entities;

        const result = [...cameras, ...instances];
        this.debugRenderer.renderEntities(result);
    }

    update(dt: number): void 
    {
        const fps = (1000 / dt).toFixed(0);
        this.debugRenderer.renderFps(fps);
    }
}