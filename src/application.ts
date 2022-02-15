import { Engine, Entity } from "tick-knock";
import {RendererOpengl} from "./renderer/renderer-opengl";
import { RendererSystem } from "./system/renderer-system";
import {DayNightSystem} from "./system/day-night-system";
import { EyePosition } from "./component/camera/eye-pos";
import { LookAtPosition } from "./component/camera/look-at";
import { QueryHolder } from "./common/query-holder";
import { DebugSystem } from "./system/debug-system";
import { MapSystem } from "./system/map-system";
import { PerspectiveCameraSystem } from "./system/perspective-camera-system";
import { PlayerSystem } from "./system/player-system";
import { FollowCameraSystem } from "./system/follow-camera-system";


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
        const mapSystem = new MapSystem();
        const playerSystem = new PlayerSystem();
        const followCameraSystem = new FollowCameraSystem();

        engine.addSystem(perspectiveCameraSystem);
        engine.addSystem(dayNightSystem);
        engine.addSystem(playerSystem);
        engine.addSystem(mapSystem);
        engine.addSystem(followCameraSystem);
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