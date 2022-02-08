import { Engine, Entity } from "tick-knock";
import { Color } from "./component/color";
import { Direction } from "./component/direction";
import { AmbientLightIntensity } from "./component/light/abmient-light-intensity";
import { SunlightIntensity } from "./component/light/sun-light-intensity";
import { Position } from "./component/position";
import { EntityTags } from "./entity/entity-tags";
import {RendererOpengl} from "./renderer/renderer-opengl";
import { RendererSystem } from "./system/renderer-system";
import { Utils } from "./utils";
import {DayNightSystem} from "./system/day-night-system";
import { EyePosition } from "./component/camera/eye-pos";
import { LookAt } from "./component/camera/look-at";
import { QueryHolder } from "./query-holder";
import { DebugSystem } from "./system/debug-system";
import { MapSystem } from "./system/map-system";


export class Application
{
    constructor()
    {
        const engine = new Engine();
        QueryHolder.addQueries(engine);

        const sun = new Entity()
            .add(new AmbientLightIntensity(0.0, 0.0, 0.0))
            .add(new SunlightIntensity(0.4, 0.4, 0.4))
            .add(new Direction(10.0, 10.0, 2.0))
            .add(EntityTags.SUN);
        
        engine.addEntity(sun);
        
        const perspectiveCamera = new Entity()
            .add(new EyePosition(0, 0, -20))
            .add(new LookAt(0, 0, 0))
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