import * as React from "react";
import * as ReactDOM from "react-dom";
import { V1 } from "../component/base/v1";
import { V3 } from "../component/base/v3";
import { AngleComponent } from "./angle-component";
import { V3Component } from "./v3-component";
import { ValueComponent } from "./value-component";

export class DebugRenderer
{
    public static renderCameraStats(cameraPos: V3, cameraLookAt: V3, headAngle: V1): void
    {
        ReactDOM.render(
            <div>
                <V3Component title={"Camera position"} v3={cameraPos} />
                <V3Component title={"Camera look at"} v3={cameraLookAt} />
                <AngleComponent title={"Head angle"} v1={headAngle} />
            </div>,
              document.getElementById("cameraPerspective")
        );
    }

    public static renderFps(fps: string): void
    {
        ReactDOM.render(
            <div>
                <ValueComponent title={"Fps: "} getVal={() => fps} />
            </div>,
              document.getElementById("fps")
        );
    }
}