
import { System } from "tick-knock";
import { QueryHolder } from "../common/query-holder";
import { RendererOpengl } from "../renderer/renderer-opengl";

export class RendererSystem extends System
{
    public constructor(public renderer: RendererOpengl)
    {
        super();
    }

    public update(): void 
    {
        const sun = QueryHolder.sunQuery.first;
        const cameraPerspective = QueryHolder.cameraPerspectiveQuery.first;

        this.renderer.render(sun, cameraPerspective);
    }
}