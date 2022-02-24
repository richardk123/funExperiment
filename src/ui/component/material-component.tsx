import * as React from "react";
import { Reflection } from "../../component/reflection";
import { SliderInput } from "../primitive/slider-input";
import {Name} from "../../component/name";
import {MaterialId} from "../../component/material-id";
import {ColorComponent} from "./color-component";
import {QueryHolder} from "../../common/query-holder";
import {Color} from "../../component/color";
import {MaterialSelect} from "../primitive/material-select";
import {ReflectionComponent} from "./reflection-component";
import {Entity} from "tick-knock";

export class MaterialComponent extends React.Component<MaterialProps, MaterialComponentState>
{
    constructor(props: MaterialProps)
    {
        super(props);
        this.materialChange = this.materialChange.bind(this);
        this.state = new MaterialComponentState(this.props.materialId?.id);
    }

    materialChange(materialId: number)
    {
        this.setState(new MaterialComponentState(materialId));
        this.props.materialId.id = materialId;
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.materialId?.id !== this.props.materialId?.id)
        {
            this.setState(new MaterialComponentState(this.props.materialId?.id));
        }
    }

    render(): React.ReactNode
    {
        return (
            this.props.materialId != undefined ?
                <div>
                    <div className="row mt-1">
                        <div className="col-md-2"><label className="form-label">Material:</label></div>
                        <div className="col">
                            <div className="input-group input-group-sm">
                                <MaterialSelect materialId={this.state.materialId} onChange={this.materialChange}/>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col-md-2"><label className="form-label">Color:</label></div>
                        <div className="col">
                            <div className="input-group input-group-sm">
                                <ColorComponent color={this.state.color}/>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col-md-2"><label className="form-label">Reflection:</label></div>
                        <div className="col">
                            <div className="input-group input-group-sm">
                                <ReflectionComponent reflection={this.state.reflection} />
                            </div>
                        </div>
                    </div>
                </div>
                : null
        );
    }
}

class MaterialComponentState
{
    materialId: number;
    entity: Entity;

    constructor(materialId: number)
    {
        this.materialId = materialId;
        this.entity = QueryHolder.materialQuery.entities
            .filter(entity => entity.get(MaterialId).id == materialId)[0];
    }

    get reflection()
    {
        return this.entity.get(Reflection);
    }

    get color()
    {
        return this.entity.get(Color);
    }
}

interface MaterialProps
{
    materialId: MaterialId;
}