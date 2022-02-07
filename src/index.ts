import { Engine, Entity } from "tick-knock";
import { Color } from "./component/color";
import { Direction } from "./component/direction";
import { AmbientLightIntensity } from "./component/light/abmient-light-intensity";
import { SunlightIntensity } from "./component/light/sun-light-intensity";
import { Position } from "./component/position";
import { EntityTags } from "./entity/entity-tags";
import {RendererGpu} from "./renderer/renderer-gpu";
import { RendererSystem } from "./system/renderer-system";
import { Utils } from "./utils";
import {DayNightSystem} from "./system/day-night-system";
import { EyePosition } from "./component/camera/eye-pos";
import { LookAt } from "./component/camera/look-at";
import { QueryHolder } from "./query-holder";


class Application
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
            .add(new EyePosition(0, -20, 0))
            .add(new LookAt(0, 0, 0))
            .add(EntityTags.CAMERA_PERSPECTIVE);
        
        engine.addEntity(perspectiveCamera);
        
        const size = 20;
        for (let x = 0; x < size; x++)
        {
            for (let y = 0; y < size; y++)
            {
                const entity = new Entity();
                entity.add(new Position(-(size / 2) + x, -(size / 2) + y , Utils.randomBool() ? 1 : 0));
                entity.add(new Color(Math.random(), Math.random() , Math.random(), 1));
                // entity.add(new Rotation(Math.PI * Math.random(), Math.PI  * Math.random() , Math.PI  * Math.random()));
                entity.add(EntityTags.CUBE);
                engine.addEntity(entity);
            }
        }

        const renderer = new RendererGpu();
        const rendererSystem = new RendererSystem(renderer);
        const dayNightSystem = new DayNightSystem();

        engine.addSystem(rendererSystem);
        engine.addSystem(dayNightSystem);

        this.mainLoop(engine, 0);
    }

    private mainLoop(engine: Engine, deltaTime: number)
    {
        document.getElementById("fps").textContent = (1000 / deltaTime).toFixed(0).toString();
        
        const prev = performance.now();
        engine.update(deltaTime);
        const dtime = performance.now() - prev;

        requestAnimationFrame(() => this.mainLoop(engine, dtime));
    }
}

new Application();