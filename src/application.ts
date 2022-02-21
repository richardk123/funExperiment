import { Engine, Entity } from "tick-knock";
import {RendererOpengl} from "./renderer/renderer-opengl";
import { RendererSystem } from "./system/renderer-system";
import { QueryHolder } from "./common/query-holder";
import { DebugSystem } from "./system/debug-system";
import { CameraSystem } from "./system/camera-system";
import { Scene } from "./common/scene";
import { Color } from "./component/color";
import { Position } from "./component/position";
import { V3 } from "./component/base/v3";
import { Modifier, ModifierType } from "./component/modifier";

export class Application
{
    constructor()
    {
        const engine = new Engine();
        QueryHolder.addQueries(engine);

        const scene = new Scene(engine);

        scene.addMaterial("blue", new Color(0, 0, 1, 1));
        scene.addMaterial("red", new Color(1, 0, 0, 1));
        scene.addMaterial("green", new Color(0, 1, 0, 1));
        scene
            .addInstance("cube", new Position(3, 0, 2), "blue")
            .setModifier(new Modifier(ModifierType.EXACT))
            .createAsCubeShape(new V3(1, 1, 1));
        scene
            .addInstance("sphere1", new Position(0, 1, 2), "red")
            .setModifier(new Modifier(ModifierType.EXACT))
            .createAsSphereShape(1);
        scene
            .addInstance("sphere2", new Position(-3, 1, 2), "green")
            .setModifier(new Modifier(ModifierType.SMOOTH, 1))
            .createAsSphereShape(1);

        const rendererSystem = new RendererSystem(new RendererOpengl());
        const perspectiveCameraSystem = new CameraSystem();
        const debugSystem = new DebugSystem();

        engine.addSystem(perspectiveCameraSystem);
        engine.addSystem(debugSystem);
        engine.addSystem(rendererSystem);

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