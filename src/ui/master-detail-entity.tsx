import * as React from "react";
import { Entity } from "tick-knock";
import { FormEntity } from "./form-entity";
import { TreeEntity } from "./tree-entity";

export class MasterDetail extends React.Component<MasterDetailData, {selected: Entity}>
{
    constructor(props: MasterDetailData)
    {
        super(props);
        this.state = {selected: this.props.entities[0]};
        this.selectEntity = this.selectEntity.bind(this);
    }

    selectEntity(id: string)
    {
        const entities = this.props.entities.filter(entity => entity.id.toString() == id);
        this.setState({selected: entities ? entities[0] : null});
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                <div className="card">
                    <div className="body">
                        <TreeEntity entities={this.props.entities} onSelect={this.selectEntity} />
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
    entities: ReadonlyArray<Entity>;
}
