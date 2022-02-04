import { Engine, Entity } from "tick-knock";
import { Color } from "./component/color";
import { Direction } from "./component/direction";
import { AmbientLightIntensity } from "./component/light/abmient-light-intensity";
import { SunlightIntensity } from "./component/light/sun-light-intensity";
import { Position } from "./component/position";
import { Rotation } from "./component/rotation";
import { EntityTags } from "./entity/entity-tags";
import {RendererGpu} from "./renderer-gpu";
import { CubeMeshRenderer } from "./system/cube-mesh-renderer";
import { Utils } from "./utils";


class Application
{
    constructor()
    {
        const engine = new Engine();
        const size = 20;

        const sun = new Entity()
            .add(new AmbientLightIntensity(0.3, 0.3, 0.3))
            .add(new SunlightIntensity(0.4, 0.4, 0.4))
            .add(new Direction(10.0, 10.0, 2.0))
            .add(EntityTags.SUN);
        
        engine.addEntity(sun);

        for (let x = 0; x < size; x++)
        {
            for (let y = 0; y < size; y++)
            {
                const entity = new Entity();
                entity.add(new Position((size / 2) - x, (size / 2) - y , Utils.randomBool() ? 1 : 0));
                entity.add(new Color(1, 0 , 0, 1));
                // entity.add(new Rotation(Math.PI * Math.random(), Math.PI  * Math.random() , Math.PI  * Math.random()));
                entity.add(EntityTags.CUBE);
                engine.addEntity(entity);
            }
        }

        const renderer = new RendererGpu();
        const cubeMeshRenderer = new CubeMeshRenderer(renderer);

        engine.addSystem(cubeMeshRenderer);

        this.mainLoop(engine, 0);
    }

    private mainLoop(engine: Engine, deltaTime: number)
    {
        document.getElementById("fps").textContent = (1000 / deltaTime).toFixed(2).toString();
        
        const prev = performance.now();
        engine.update(deltaTime);
        const dtime = performance.now() - prev;

        requestAnimationFrame(() => this.mainLoop(engine, dtime));
    }
}

new Application();