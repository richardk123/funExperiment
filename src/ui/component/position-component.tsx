import * as React from "react";
import { Position } from "../../component/position";
import { NumberInput } from "../primitive/number-input";
import {V3} from "../../component/base/v3";

export class PositionComponent extends React.Component<PositionProps>
{
    constructor(props: PositionProps)
    {
        super(props);
    }

    render(): React.ReactNode 
    {
        return (
            this.props.position != undefined ?
                <div className="row mt-3">
                    <div className="col-md-2"><label className="form-label">{this.props.title}</label></div>
                    <div className="col">
                        <div className="row">
                            <div className="col-sm-3 position-x">
                                <div className="input-group input-group-sm">
                                    <div className="input-group-text">X:</div>
                                    <NumberInput value={this.props.position.x} onChange={(val) => this.props.position.x = val} />
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="input-group input-group-sm">
                                    <div className="input-group-text">Y:</div>
                                    <NumberInput value={this.props.position.y} onChange={(val) => this.props.position.y = val} />
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="input-group input-group-sm">
                                    <div className="input-group-text">Z:</div>
                                    <NumberInput value={this.props.position.z} onChange={(val) => this.props.position.z = val} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            : null
        );
    }
}

interface PositionProps
{
    position?: V3;
    title: string;
}