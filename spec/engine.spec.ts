import { Engine } from "tick-knock";
import { Scene } from "../src/common/scene";
import { V3 } from "../src/component/base/v3";
import { Position } from "../src/component/position";
import { Rotation } from "../src/component/rotation";

test('test creating roots', () => 
{
    const engine = new Engine();
    const scene = new Scene(engine);

    scene
        .addInstance(new Position(0, 0, 0))
            .createAsSphereShape(6)
        .addInstance(new Position(2, 0, 0))
            .setRotation(new Rotation(Math.PI, 0, 0, 1))
            .createAsCubeShape(new V3(1, 1, 1))
        .addInstance(new Position(-1, 0, 0))
            .createAsSphereShape(2);
});