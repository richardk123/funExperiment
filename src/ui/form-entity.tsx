import * as React from "react";
import { Entity } from "tick-knock";
import { Color } from "../component/color";
import { Position } from "../component/position";
import { ColorComponent } from "./color-component";
import { PositionComponent } from "./position-component";

export class FormEntity extends React.Component<FormData>
{
    constructor(props: FormData)
    {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div>
                {
                    this.props.entity ? 
                    <form className="entity-form">
                        {this.props.entity.id}
                        <PositionComponent position={this.props.entity.get(Position)}/>
                        <ColorComponent color={this.props.entity.get(Color)}/>
                    </form>
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