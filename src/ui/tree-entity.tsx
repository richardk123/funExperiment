import { Tree } from "antd";
import { Key } from "antd/lib/table/interface";
import * as React from "react";
import { Entity } from "tick-knock";
import { Name } from "../component/name";

export class TreeEntity extends React.Component<TreeData, TreeDataState>
{
    constructor(props: TreeData)
    {
        super(props);
        this.select = this.select.bind(this);
        this.state = new TreeDataState(props.entities, props.selected);
    }

    static getDerivedStateFromProps(props, state) {
        return new TreeDataState(props.entities, props.selected);
    }

    select(ids: Key[]): void
    {
        const id = ids[0] ? ids[0].toString() : null;
        this.props.onSelect(id);
    }

    render(): React.ReactNode
    {
        return (
            <Tree treeData={this.state.data} onSelect={this.select} selectedKeys={this.state.selected} />
        );
    }
    
}

interface TreeData
{
    onSelect: (id: string) => void;
    entities: ReadonlyArray<Entity>;
    selected: Entity | undefined;
}

class TreeDataState
{
    data: {key: string, title: string}[];
    selected: Array<string>;

    constructor(entities: ReadonlyArray<Entity>, selected: Entity)
    {
        this.data = entities.map(entity =>
        {
            return {key : entity.id.toString(), title: entity.has(Name) ? entity.get(Name).name : "Entity" + entity.id}
        });

        if (selected)
        {
            this.selected = [selected.id.toString()];
        }
        else
        {
            this.selected = [];
        }
    }
}