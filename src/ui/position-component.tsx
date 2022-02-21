import * as React from "react";
import { Position } from "../component/position";
import { NumberInput } from "./number-input";

export class PositionComponent extends React.Component<PositionProps>
{
    constructor(props: PositionProps)
    {
        super(props);
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                {
                    this.props.position != undefined ? 
                    <div>
                        <span>Position:</span>
                        <span><NumberInput title="X:" value={this.props.position.x} onChange={(val) => this.props.position.x = val} /></span>
                        <span><NumberInput title="Y:" value={this.props.position.y} onChange={(val) => this.props.position.y = val} /></span>
                        <span><NumberInput title="Z:" value={this.props.position.z} onChange={(val) => this.props.position.z = val} /></span>
                    </div> : ""
                }
            </div>

        );


    }
}

interface PositionProps
{
    position?: Position;
}