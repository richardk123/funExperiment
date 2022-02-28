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
import {NameComponent} from "./name-component";

export class MaterialComponent extends React.Component<MaterialProps, MaterialComponentState>
{
    constructor(props: MaterialProps)
    {
        super(props);
        this.state = new MaterialComponentState(this.props.materialId?.id);
        this.onMaterialChange = this.onMaterialChange.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
    }

    onMaterialChange(materialId: number)
    {
        this.setState(new MaterialComponentState(materialId));
        this.props.materialId.id = materialId;
    }

    static getDerivedStateFromProps(props, state) {
        const result = new MaterialComponentState(props.materialId?.id);
        result.changeName = state.changeName;
        return result;
    }

    onChangeName()
    {
        const result = new MaterialComponentState(this.state.materialId);
        result.changeName = !this.state.changeName;
        this.setState(result);
    }

    render(): React.ReactNode
    {
        return (
            this.props.materialId != undefined ?
                <div>
                    <div className="row mt-3">
                        <div className="col-md-2"><label className="form-label">Material:</label></div>
                        <div className="col">
                            {this.state.changeName ?
                                <NameComponent name={this.state.name} onEnter={this.onChangeName}/>
                                :
                                <div className="row mt-1">
                                    <div className="col-md-2"><label className="form-label">Name:</label></div>
                                    <div className="col">
                                        <div className="input-group input-group-sm">
                                            <MaterialSelect materialId={this.state.materialId} onChange={this.onMaterialChange}/>
                                            <button type="button" className="btn btn-primary" onClick={this.onChangeName}>Edit</button>
                                        </div>
                                    </div>
                                </div>
                            }
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
    reflection: Reflection;
    color: Color;
    name: Name;
    changeName: boolean;

    constructor(materialId: number)
    {
        this.changeName = false;
        this.materialId = materialId;
        this.entity = QueryHolder.materialQuery.entities
            .filter(entity => entity.get(MaterialId).id == materialId)[0];
        if (this.entity)
        {
            this.reflection = this.entity.get(Reflection);
            this.color = this.entity.get(Color);
            this.name = this.entity.get(Name);
        }
    }

}

interface MaterialProps
{
    materialId: MaterialId;
}