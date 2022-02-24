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
import {NameComponent} from "./component/name-component";
import {Name} from "../component/name";
import {MaterialComponent} from "./component/material-component";
import {MaterialId} from "../component/material-id";

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
                    <div className="container">
                        <div className="row">
                            <div className="col-md-2"><label className="form-label">Id:</label></div>
                            <div className="col">{this.props.entity.id}</div>
                        </div>
                        <NameComponent name={this.props.entity.get(Name)}/>
                        <PositionComponent position={this.props.entity.get(Position)}/>
                        <MaterialComponent materialId={this.props.entity.get(MaterialId)}/>
                        <ModifierComponent modifier={this.props.entity.get(Modifier)} />
                    </div>
                    :
                    null
            }
            </div>
        );
    }
}

interface FormData
{
    entity: Entity;
}