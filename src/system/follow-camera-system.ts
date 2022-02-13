import { System } from "tick-knock";
import { QueryHolder } from "../common/query-holder";
import { EyePosition } from "../component/camera/eye-pos";
import { LookAtPosition } from "../component/camera/look-at";
import { Head } from "../component/player/head";
import { Tail } from "../component/player/tail";
import { Position } from "../component/position";

export class FollowCameraSystem extends System
{
    update(dt: number): void 
    {
        const camera = QueryHolder.cameraPerspectiveQuery.first;
        const player = QueryHolder.playerQuery.first;
        const tail = player.get(Tail);
        const head = player.get(Head);

        const camPos = camera.get(EyePosition);
        const lookAt = camera.get(LookAtPosition);
        
        camPos.x = tail.x;
        camPos.z = tail.z;
        lookAt.x = head.x;
        lookAt.y = head.y;
        lookAt.z = head.z;
    }
}