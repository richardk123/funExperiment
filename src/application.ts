import { Engine, Entity } from "tick-knock";
import { Direction } from "./component/direction";
import { AmbientLightIntensity } from "./component/light/abmient-light-intensity";
import { SunlightIntensity } from "./component/light/sun-light-intensity";
import { EntityTags } from "./entity/entity-tags";
import {RendererOpengl} from "./renderer/renderer-opengl";
import { RendererSystem } from "./system/renderer-system";
import {DayNightSystem} from "./system/day-night-system";
import { EyePosition } from "./component/camera/eye-pos";
import { LookAtPosition } from "./component/camera/look-at";
import { QueryHolder } from "./query-holder";
import { DebugSystem } from "./system/debug-system";
import { MapSystem } from "./system/map-system";


export class Application
{
    constructor()
    {
        const engine = new Engine();
        QueryHolder.addQueries(engine);

        const perspectiveCamera = new Entity()
            .add(new EyePosition(0, 0, -20))
            .add(new LookAtPosition(0, 0, 0))
            .add(EntityTags.CAMERA_PERSPECTIVE);
        
        engine.addEntity(perspectiveCamera);
        

        const renderer = new RendererOpengl();
        const rendererSystem = new RendererSystem(renderer);
        const dayNightSystem = new DayNightSystem();
        const debugSystem = new DebugSystem();
        const mapSystem = new MapSystem();

        engine.addSystem(rendererSystem);
        engine.addSystem(dayNightSystem);
        engine.addSystem(debugSystem);
        engine.addSystem(mapSystem)

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