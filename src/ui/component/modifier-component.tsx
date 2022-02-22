import * as React from "react";
import { Modifier, ModifierType } from "../../component/modifier";
import { EnumSelect } from "../primitive/enum-select";
import { SliderInput } from "../primitive/slider-input";

export class ModifierComponent extends React.Component<ModifierProps, {type: ModifierType}>
{
    constructor(props: ModifierProps)
    {
        super(props);
        this.state = {type: props.modifier?.type};
        this.changeType = this.changeType.bind(this);
    }

    changeType(type: ModifierType)
    {
        this.props.modifier.type = type;
        this.setState({type: type});
    }

    componentDidUpdate(prevProps) 
    {
        if(prevProps.modifier?.type !== this.props.modifier?.type) 
        {
          this.setState({type: this.props.modifier?.type});
        }
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                {
                    this.props.modifier != undefined ? 
                        <div className="row mt-1">
                            <div className="row">
                                <div className="col-md-2"><label className="form-label">Modifier:</label></div>
                                <div className="col">
                                    <div className="input-group input-group-sm">
                                        <div className="input-group-text">Type:</div>
                                        <EnumSelect type={ModifierType} value={this.props.modifier.type} onChange={this.changeType}/>
                                    </div>
                                </div>
                            </div> 
                            {
                                this.state.type == 2 ?
                                    <div className="row d-flex  mt-1">
                                        <div className="col-md-2"></div>
                                        <div className="col">
                                            <div className="d-flex input-group-sm">
                                                <div className="input-group-text">Smin:</div>
                                                <SliderInput min={0.0} max={5.0} step={0.01} value={this.props.modifier.smoothness} onChange={(value) => this.props.modifier.smoothness = value} />
                                            </div>
                                        </div>
                                    </div>
                                : null
                            }

                        </div> 
                    : null
                }
            </div>
        );
    }
}

interface ModifierProps
{
    modifier?: Modifier;
}