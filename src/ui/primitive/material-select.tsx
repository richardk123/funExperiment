import * as React from "react";
import {Entity} from "tick-knock";
import {MaterialId} from "../../component/material-id";
import {QueryHolder} from "../../common/query-holder";
import {Name} from "../../component/name";

export class MaterialSelect extends React.Component<MaterialData, {value: number}>
{
    constructor(props: MaterialData)
    {
        super(props);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.state = {value: props.materialId};
    }

    render(): React.ReactNode
    {
        return (
            <select className="form-select"
                    onChange={this.handleChangeEvent}
                    value={this.state.value}>
                {
                    QueryHolder.materialQuery.entities
                        .map(val =>
                        {
                            const name = val.get(Name).name;
                            const id = val.get(MaterialId).id;

                            return <option key={id} value={id} data-id={id}>{name}</option>;
                        })
                }
            </select>
        );
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.materialId !== this.props.materialId)
        {
            this.setState({value: this.props.materialId});
        }
    }

    handleChangeEvent(e: React.ChangeEvent<HTMLSelectElement>): void
    {
        const select = e.target;
        const value = select.options[select.selectedIndex];
        const val = parseInt(value.getAttribute('data-id'));
        this.setState({value: val});
        this.props.onChange(val);
    }
}

interface MaterialData
{
    materialId: number;
    onChange: (materialId: number) => void;
}