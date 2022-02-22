import * as React from "react";
import { Entity } from "tick-knock";
import { Color } from "../component/color";
import { Modifier, ModifierType } from "../component/modifier";
import { Position } from "../component/position";
import { Reflection } from "../component/reflection";
import { ColorComponent } from "./component/color-component";
import { ModifierComponent } from "./component/modifier-component";
import { PositionComponent } from "./component/position-component";
import { ReflectionComponent } from "./component/reflection-component";
import { EnumSelect } from "./primitive/enum-select";
import { SliderInput } from "./primitive/slider-input";

export class FormEntity extends React.Component<FormData>
{
    constructor(props: FormData)
    {
        super(props);
    }

    render(): React.ReactNode 
    {

        return (
            <div>
                {
                    this.props.entity ? 
                    <div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-2"><label className="form-label">Id:</label></div>
                                <div className="col">{this.props.entity.id}</div>
                            </div>
                        </div>
                        <PositionComponent position={this.props.entity.get(Position)}/>
                        <ColorComponent color={this.props.entity.get(Color)}/>
                        <ReflectionComponent reflection={this.props.entity.get(Reflection)} />
                        <ModifierComponent modifier={this.props.entity.get(Modifier)} />
                    </div>
                    : ""
                }

            </div>
        );
    }
}

interface FormData
{
    entity: Entity;
}