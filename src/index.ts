import { Vector } from 'vector2d';
import { Physics } from './physics';
import { RendererCpu } from './renderer-cpu';
import { Star } from './star';
import {Renderer} from "./renderer";
import {RendererGpu} from "./renderer-gpu";


class Application
{
    physics: Physics;
    renderer: Renderer;

    constructor()
    {
        this.renderer = new RendererGpu();
        this.physics = new Physics(this.renderer.width, this.renderer.height);
        this.mainLoop();
    }

    private mainLoop()
    {
        requestAnimationFrame(() => this.mainLoop());
        
        this.physics.simulate();
        this.renderer.render(this.physics.stars);
        // this.renderer.renderDebugCircles(this.physics.stars);
    }
}

new Application();