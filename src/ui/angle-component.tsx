import * as React from "react";
import { V1 } from "../component/base/v1";
import { SliderComponent } from "./slider-component";

export class AngleComponent extends React.Component<V1Props>
{
   
    render(): React.ReactNode {
        return (
            <div>
                <div>{this.props.title}</div>
                <SliderComponent title="Angle:" min={-180} max={180} getVal={() => this.props.v1.value} setVal={(val) => this.props.v1.value = val}/>
            </div>
        );
    }
}

interface V1Props
{
    title: string;
    v1: V1;
}