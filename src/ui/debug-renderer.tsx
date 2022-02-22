import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "tick-knock";
import { MasterDetail } from "./master-detail-entity";
import { ValueComponent } from "./primitive/value-text";

export class DebugRenderer
{
    public renderEntities(entities: ReadonlyArray<Entity>): void
    {
        ReactDOM.render(
            <div>
                <MasterDetail entities={entities} />
            </div>,
            document.getElementById("masterDetail")
        );
    }

    public renderFps(fps: string): void
    {
        ReactDOM.render(
            <div>
                <ValueComponent title={"Fps: "} getVal={() => fps} />
            </div>,
            document.getElementById("fps")
        );
    }
}