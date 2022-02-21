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
                        <label className="form-label">Position:</label>
                        <div className="input-group">
                            <div className="col-auto">
                                <label className="form-label">X:</label>
                                <NumberInput id="posX" value={this.props.position.x} onChange={(val) => this.props.position.x = val} />
                            </div>
                            <div className="col-auto">
                                <label className="form-label">Y:</label>
                                <NumberInput id="posY" value={this.props.position.y} onChange={(val) => this.props.position.y = val} />
                            </div>
                            <div className="col-auto">
                                <label className="form-label">Z:</label>
                                <NumberInput id="posZ" value={this.props.position.z} onChange={(val) => this.props.position.z = val} />
                            </div>
                        </div>
                        
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