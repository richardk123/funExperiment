import * as React from "react";
import {Name} from "../../component/name";

export class NameComponent extends React.Component<ReflectionProps, {value: string}>
{
    constructor(props: ReflectionProps)
    {
        super(props);
        this.valueChange = this.valueChange.bind(this);
        this.state = {value: props.name?.name};

        this.handleEnter = this.handleEnter.bind(this);
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
                                           value={this.state.value}
                                           onKeyPress={this.handleEnter}
                                           onChange={this.valueChange}/>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
        );
    }

    handleEnter(e: React.KeyboardEvent<HTMLInputElement>): void
    {
        if (e.key === 'Enter')
        {
            const value = (e.target as HTMLInputElement).value;
            this.props.onEnter(value);
        }
    }
}

interface ReflectionProps
{
    name?: Name;

    onEnter?: (val: string) => void;
}