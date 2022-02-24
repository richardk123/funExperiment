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

export class MaterialComponent extends React.Component<MaterialProps>
{
    constructor(props: MaterialProps)
    {
        super(props);
        this.materialChange = this.materialChange.bind(this);
        this.state = {materialId: props.materialId?.id};
    }

    getColor(): Color
    {
        return QueryHolder.materialQuery.entities
            .filter(entity => entity.get(MaterialId).id == this.props.materialId.id)[0]
            .get(Color);
    }

    getReflection(): Reflection
    {
        return QueryHolder.materialQuery.entities
            .filter(entity => entity.get(MaterialId).id == this.props.materialId.id)[0]
            .get(Reflection);
    }

    // componentDidUpdate(prevProps)
    // {
    //     if(prevProps.materialId !== this.props.materialId)
    //     {
    //         this.setState({materialId: this.props.materialId?.id});
    //     }
    // }

    materialChange(materialId: number)
    {
        this.props.materialId.id = materialId;
        // this.setState({materialId: materialId});
    }

    render(): React.ReactNode
    {
        return (
            <div>
                {
                    this.props.materialId != undefined ?
                        <div>
                            <div className="row mt-1">
                                <div className="col-md-2"><label className="form-label">Material:</label></div>
                                <div className="col">
                                    <div className="input-group">
                                        <MaterialSelect materialId={this.props.materialId.id} onChange={this.materialChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-md-2"><label className="form-label">Color:</label></div>
                                <div className="col">
                                    <div className="input-group">
                                        <ColorComponent color={this.getColor()}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-md-2"><label className="form-label">Reflection:</label></div>
                                <div className="col">
                                    <div className="input-group">
                                        <ReflectionComponent reflection={this.getReflection()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
        );
    }
}

interface MaterialProps
{
    materialId?: MaterialId;
}