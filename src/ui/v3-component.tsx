import * as React from "react";
import { V3 } from "../component/base/v3";
import { SliderComponent } from "./slider-component";

export class V3Component extends React.Component<V3Props>
{
   
    render(): React.ReactNode {
        return (
            <div>
                <div>{this.props.title}</div>
                <SliderComponent title="X:" min={-50} max={50} getVal={() => this.props.v3.x} setVal={(val) => this.props.v3.x = val}/>
                <SliderComponent title="Y:" min={-50} max={50} getVal={() => this.props.v3.y} setVal={(val) => this.props.v3.y = val}/>
                <SliderComponent title="Z:" min={-50} max={50} getVal={() => this.props.v3.z} setVal={(val) => this.props.v3.z = val}/>
            </div>
        );
    }
}

interface V3Props
{
    title: string;
    v3: V3;
}