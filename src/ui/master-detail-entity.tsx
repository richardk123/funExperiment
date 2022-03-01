import * as React from "react";
import { Entity } from "tick-knock";
import { FormEntity } from "./form-entity";
import { TreeEntity } from "./tree-entity";
import {QueryHolder} from "../common/query-holder";
import {Scene} from "../common/scene";
import {Name} from "../component/name";
import {Color} from "../component/color";
import {Position} from "../component/position";
import {V3} from "../component/base/v3";

export class MasterDetail extends React.Component<MasterDetailData, MasterDetailState>
{
    constructor(props: MasterDetailData)
    {
        super(props);

        this.state = new MasterDetailState(null);
        this.selectEntity = this.selectEntity.bind(this);
        this.deleteEntity = this.deleteEntity.bind(this);
        this.createEntity = this.createEntity.bind(this);
    }

    selectEntity(id: string): void
    {
        const entities = this.state.entities.filter(entity => entity.id.toString() == id);
        const selected = entities ? entities[0] : null;

        this.setState(new MasterDetailState(selected));
    }

    deleteEntity(): void
    {
        Scene.get().remove(this.state.selected);
        this.setState(new MasterDetailState(null));
    }

    createEntity(): void
    {
        const material = QueryHolder.materialQuery.entities[0];
        const scene = Scene.get();
        let materialName = null;

        if (material)
        {
            materialName = material.get(Name).name;
        }
        else
        {
            scene.addMaterial("default-material", new Color(1, 0, 0, 1), 0);
            materialName = "default-material";
        }

        const entity = scene.addInstance("new instance", new Position(0, 0, 0), materialName)
            .createAsCube(new V3(1, 1, 1));

        this.setState(new MasterDetailState(entity));
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                <div className="card">
                    <div className="body">
                        <input type="button" className="btn btn-light btn-sm" onClick={this.createEntity} value="Create" />
                        <input type="button" className="btn btn-light btn-sm" readOnly={this.state.selected == undefined}  onClick={this.deleteEntity} value="Delete" />
                    </div>
                </div>

                <div className="card">
                    <div className="body">
                        <TreeEntity entities={this.state.entities} onSelect={this.selectEntity} selected={this.state.selected} />
                    </div>
                </div>
                <div className="card">
                    <div className="body">
                        <FormEntity entity={this.state.selected} />
                    </div>
                </div>
            </div>
        );
    }
}


interface MasterDetailData
{
}

export class MasterDetailState
{
    public entities: ReadonlyArray<Entity>;

    constructor(public selected: Entity)
    {
        const instances = QueryHolder.instanceQuery.entities;
        const cameras = QueryHolder.cameraQuery.entities;

        this.entities = [...cameras, ...instances];
    }

}
