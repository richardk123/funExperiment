import * as React from "react";
import * as ReactDOM from "react-dom";
import { Entity } from "tick-knock";
import { FormEntity } from "./form-entity";
import { MasterDetail } from "./master-detail-entity";
import { ValueComponent } from "./primitive/value-text";
import { TreeEntity } from "./tree-entity";

export class DebugRenderer
{
    constructor()
    {
        document.onclick = (e) =>
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

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