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
            <div>
                {
                    this.props.reflection != undefined ? 
                        <div className="row">
                            <div className="col-md-2"><label className="form-label">Reflection:</label></div>
                            <div className="col">
                                <div className="input-group input-group-sm">
                                    <SliderInput min={0.0} max={1.0} step={0.01} value={this.props.reflection.value} onChange={(value) => this.props.reflection.value = value} />
                                </div>
                            </div>
                        </div> 
                    : ""
                }
            </div>

        );
    }
}

interface ReflectionProps
{
    reflection?: Reflection;
}