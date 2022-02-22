import * as React from "react";

export class EnumSelect<T> extends React.Component<EnumData<T>, {value: string}>
{
    constructor(props: EnumData<T>)
    {
        super(props);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.state = {value: this.props.type[this.props.value]};
    }

    render(): React.ReactNode 
    {
        return (
            <select className="form-select" 
                onChange={this.handleChangeEvent} 
                value={this.state.value}>
                    {
                        Object.values(this.props.type)
                            .filter(x => isNaN(parseInt(x)))
                            .map(val => 
                            {
                                return <option key={val}>{val}</option>;
                            })
                    }
            </select>
        );
    }

    componentDidUpdate(prevProps) 
    {
        if(prevProps.value !== this.props.value) 
        {
          this.setState({value: this.props.type[this.props.value]});
        }
    }

    handleChangeEvent(e: React.ChangeEvent<HTMLSelectElement>): void
    {
        const value = this.props.type[e.target.value];
        this.setState({value: value});
        this.props.onChange(value);
    }

}

interface EnumData<T>
{
    type: T;
    value: number;
    onChange: (val: number) => void;
}