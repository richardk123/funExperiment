import { Engine, Entity } from "tick-knock";
import { Color } from "./component/color";
import { Position } from "./component/position";
import {Renderer} from "./renderer";
import {RendererGpu} from "./renderer-gpu";
import { CubeMeshRenderer } from "./system/cube-mesh-renderer";


class Application
{
    constructor()
    {
        const engine = new Engine();

        const entity = new Entity();
        entity.add(new Position(0, 0 ,0));
        entity.add(new Color(1, 0 ,0, 1));
        engine.addEntity(entity);

        const entity2 = new Entity();
        entity2.add(new Position(1, 1 ,0));
        entity2.add(new Color(0, 1 ,0, 1));
        engine.addEntity(entity2);

        const renderer = new RendererGpu();
        const cubeMeshRenderer = new CubeMeshRenderer(renderer);

        engine.addSystem(cubeMeshRenderer);

        this.mainLoop(engine, performance.now());
    }

    private mainLoop(engine: Engine, currentTime: number)
    {
        
        requestAnimationFrame(() => this.mainLoop(engine, performance.now()));

        const deltaTime = performance.now() - currentTime;
        engine.update(deltaTime);
    }
}

new Application();