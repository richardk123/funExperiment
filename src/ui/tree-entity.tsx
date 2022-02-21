import * as React from "react";
import Tree, { NodeId } from '@naisutech/react-tree'
import { Entity } from "tick-knock";
import { Name } from "../component/name";

export class TreeEntity extends React.Component<TreeData>
{
    constructor(props: TreeData)
    {
        super(props);
        this.select = this.select.bind(this);
    }

    select(ids: NodeId[])
    {
        const id = ids[0] ? ids[0].toString() : null;
        this.props.onSelect(id);
    }

    getName(entity: Entity)
    {
        return entity.has(Name) ? entity.get(Name).name : "Entity" + entity.id;
    }

    render(): React.ReactNode 
    {
        const data = this.props.entities.map(entity =>
        {
            return {id : entity.id, parentId: null, label: this.getName(entity)}
        });

        return (
            <div>
                <Tree nodes={data} onSelect={this.select} />
            </div>
        );
    }
    
}

interface TreeData
{
    onSelect: (id: string) => void;
    entities: ReadonlyArray<Entity>;
}