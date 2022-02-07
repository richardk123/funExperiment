import * as React from "react";
import * as ReactDOM from "react-dom";
import { V3 } from "../component/base/v3";
import { V3Component } from "./v3-component";

export class DebugRenderer
{
    public render(title: string, v3: V3): void
    {
        ReactDOM.render(
            <V3Component title={title} v3={v3} />,
              document.getElementById("debug")
        );
    }
}