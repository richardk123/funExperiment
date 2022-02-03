import { Engine, Entity } from "tick-knock";
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
        entity.add(new Position(1, 0 ,0));
        engine.addEntity(entity);

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