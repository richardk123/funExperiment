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
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3"><label className="form-label">Position:</label></div>
                            <div className="col">
                                <div className="input-group">
                                    <div className="input-group-text">X:</div>
                                    <NumberInput value={this.props.position.x} onChange={(val) => this.props.position.x = val} />
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-group">
                                    <div className="input-group-text">Y:</div>
                                    <NumberInput value={this.props.position.y} onChange={(val) => this.props.position.y = val} />
                                </div>
                            </div>
                            <div className="col">
                                <div className="input-group">
                                    <div className="input-group-text">Z:</div>
                                    <NumberInput value={this.props.position.z} onChange={(val) => this.props.position.z = val} />
                                </div>
                            </div>
                        </div> 
                    </div> 
                    : ""
                }
            </div>

        );


    }
}

interface PositionProps
{
    position?: Position;
}