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
    frame = 0;

    constructor()
    {
        this.renderer = new RendererGpu();
        this.physics = new Physics(this.renderer.width, this.renderer.height);
        this.mainLoop();
    }

    private mainLoop()
    {
        this.frame++;
        requestAnimationFrame(() => this.mainLoop());

        console.log(this.frame);
        if (this.frame % 2)
        {
            this.physics.simulate();
        }

        this.renderer.render(this.physics.stars);
        // this.renderer.renderDebugCircles(this.physics.stars);
    }
}

new Application();