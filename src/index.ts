import { Vector } from 'vector2d';
import { Physics } from './physics';
import { Renderer } from './renderer';
import { Star } from './star';


class Application
{
    physics: Physics
    renderer: Renderer;

    constructor()
    {
        this.renderer = new Renderer();
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