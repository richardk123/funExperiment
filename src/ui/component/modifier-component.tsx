import * as React from "react";
import { Modifier, ModifierType } from "../../component/modifier";
import { EnumSelect } from "../primitive/enum-select";
import { SliderInput } from "../primitive/slider-input";

export class ModifierComponent extends React.Component<ModifierProps>
{
    constructor(props: ModifierProps)
    {
        super(props);
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                {
                    this.props.modifier != undefined ? 
                        <div className="row">
                            <div className="row">
                                <div className="col-md-2"><label className="form-label">Modifier:</label></div>
                                <div className="col">
                                    <div className="input-group input-group-sm">
                                        <div className="input-group-text">Type:</div>
                                        <EnumSelect type={ModifierType} value={this.props.modifier.type} onChange={(type) => this.props.modifier.type = type}/>
                                    </div>
                                </div>
                            </div> 
                            <div className="row d-flex">
                                <div className="col-md-2"></div>
                                <div className="col">
                                    <div className="d-flex input-group-sm">
                                        <div className="input-group-text">Smin:</div>
                                        <SliderInput min={0.0} max={5.0} step={0.01} value={this.props.modifier.smoothness} onChange={(value) => this.props.modifier.smoothness = value} />
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

interface ModifierProps
{
    modifier?: Modifier;
}