import {Renderer} from "./renderer";
import {RendererGpu} from "./renderer-gpu";


class Application
{
    renderer: Renderer;
    frame = 0;

    constructor()
    {
        this.renderer = new RendererGpu();
        this.mainLoop();
    }

    private mainLoop()
    {
        this.frame++;
        requestAnimationFrame(() => this.mainLoop());


        this.renderer.render();
    }
}

new Application();