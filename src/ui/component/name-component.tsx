import * as React from "react";
import { Reflection } from "../../component/reflection";
import { SliderInput } from "../primitive/slider-input";
import {Name} from "../../component/name";

export class NameComponent extends React.Component<ReflectionProps>
{
    constructor(props: ReflectionProps)
    {
        super(props);
        this.valueChange = this.valueChange.bind(this);
        this.state = {value: props.name?.name};
    }

    valueChange(e: React.ChangeEvent<HTMLInputElement>): void
    {
        const value = e.target.value;
        this.props.name.name = value;
        this.setState({value: value});
    }

    render(): React.ReactNode
    {
        return (
            <div>
                {
                    this.props.name != undefined ?
                        <div className="row mt-1">
                            <div className="col-md-2"><label className="form-label">Name:</label></div>
                            <div className="col">
                                <div className="input-group input-group-sm">
                                    <input type="text"
                                           className="form-control"
                                           value={this.props.name.name}
                                           onChange={this.valueChange}/>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
        );
    }
}

interface ReflectionProps
{
    name?: Name;
}