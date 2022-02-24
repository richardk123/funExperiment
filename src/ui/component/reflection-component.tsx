import * as React from "react";
import { Reflection } from "../../component/reflection";
import { SliderInput } from "../primitive/slider-input";

export class ReflectionComponent extends React.Component<ReflectionProps>
{
    constructor(props: ReflectionProps)
    {
        super(props);
    }

    render(): React.ReactNode 
    {
        return (
            <SliderInput min={0.0} max={1.0} step={0.01} value={this.props.reflection.value} onChange={(value) => this.props.reflection.value = value} />
        );
    }
}

interface ReflectionProps
{
    reflection?: Reflection;
}