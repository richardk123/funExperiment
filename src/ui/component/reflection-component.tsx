import * as React from "react";
import { Reflection } from "../../component/reflection";
import { SliderInput } from "../primitive/slider-input";

export class ReflectionComponent extends React.Component<ReflectionProps>
{
    constructor(props: ReflectionProps)
    {
        super(props);
        this.reflectionChange = this.reflectionChange.bind(this);
    }

    reflectionChange(value: number)
    {
        this.props.reflection.value = value;
    }

    render(): React.ReactNode 
    {
        return (
            this.props.reflection !== undefined ?
                <SliderInput min={0.0} max={1.0} step={0.01} value={this.props.reflection.value} onChange={this.reflectionChange} />
            : null
        );
    }
}

interface ReflectionProps
{
    reflection?: Reflection;
}