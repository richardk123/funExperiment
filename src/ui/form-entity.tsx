import * as React from "react";
import { Entity } from "tick-knock";
import { Modifier, ModifierType } from "../component/modifier";
import { Position } from "../component/position";
import { ModifierComponent } from "./component/modifier-component";
import { PositionComponent } from "./component/position-component";
import { ReflectionComponent } from "./component/reflection-component";
import {NameComponent} from "./component/name-component";
import {Name} from "../component/name";
import {MaterialComponent} from "./component/material-component";
import {MaterialId} from "../component/material-id";
import {ShapeComponent} from "./component/shape-component";
import {Shape} from "../component/shape";
import {Scene} from "../common/scene";
import {V3} from "../component/base/v3";
import {QueryHolder} from "../common/query-holder";
import {Color} from "../component/color";

export class FormEntity extends React.Component<FormData>
{
    constructor(props: FormData)
    {
        super(props);
    }

    render(): React.ReactNode
    {

        return (
            this.props.entity ?
                <div className="container">
                    <div className="row mt-2">
                        <div className="col-md-2"><label className="form-label">Id:</label></div>
                        <div className="col">{this.props.entity.id}</div>
                    </div>
                    <NameComponent name={this.props.entity.get(Name)}/>
                    <PositionComponent position={this.props.entity.get(Position)} title={"Position:"}/>
                    <ModifierComponent modifier={this.props.entity.get(Modifier)} />
                    <MaterialComponent materialId={this.props.entity.get(MaterialId)}/>
                    <ShapeComponent shape={this.props.entity.get(Shape)}/>
                </div>
                :
                null
        );
    }
}

interface FormData
{
    entity: Entity;
}