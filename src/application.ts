import { Engine, Entity } from "tick-knock";
import {RendererOpengl} from "./renderer/renderer-opengl";
import { RendererSystem } from "./system/renderer-system";
import { QueryHolder } from "./common/query-holder";
import { DebugSystem } from "./system/debug-system";
import { PerspectiveCameraSystem } from "./system/perspective-camera-system";
import { DayNightSystem } from "./system/day-night-system";

export class Application
{
    constructor()
    {
        const engine = new Engine();
        QueryHolder.addQueries(engine);

        const rendererSystem = new RendererSystem(new RendererOpengl());
        const perspectiveCameraSystem = new PerspectiveCameraSystem();
        const dayNightSystem = new DayNightSystem();
        const debugSystem = new DebugSystem();

        engine.addSystem(perspectiveCameraSystem);
        engine.addSystem(dayNightSystem);
        engine.addSystem(debugSystem);
        engine.addSystem(rendererSystem);

        this.mainLoop(engine, 0);
    }

    private mainLoop(engine: Engine, deltaTime: number)
    {
        const prev = performance.now();
        engine.update(deltaTime);
        const dtime = performance.now() - prev;

        requestAnimationFrame(() => this.mainLoop(engine, dtime));
    }
}