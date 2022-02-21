import * as React from "react";
import { Entity } from "tick-knock";
import { FormEntity } from "./form-entity";
import { TreeEntity } from "./tree-entity";

export class MasterDetail extends React.Component<MasterDetailData, {selected: Entity}>
{
    constructor(props: MasterDetailData)
    {
        super(props);
        this.selectEntity = this.selectEntity.bind(this);
        this.state = {selected: this.props.entities[0]};
    }

    selectEntity = (id: string) => 
    {
        const entities = this.props.entities.filter(entity => entity.id.toString() == id);
        this.setState({selected: entities ? entities[0] : null});
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                <TreeEntity entities={this.props.entities} onSelect={id => this.selectEntity(id)} />
                <FormEntity entity={this.state.selected} />
            </div>
        );
    }
}


interface MasterDetailData
{
    entities: ReadonlyArray<Entity>;
}
