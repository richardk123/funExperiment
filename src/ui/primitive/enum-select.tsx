import * as React from "react";

export class EnumSelect<T> extends React.Component<EnumData<T>, {value: number}>
{
    constructor(props: EnumData<T>)
    {
        super(props);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.preventDefault = this.preventDefault.bind(this);
        this.state = {value: props.value};
    }

    render(): React.ReactNode 
    {
        return (
            <select className="form-select" onChange={this.handleChangeEvent} onClick={this.preventDefault} defaultValue={this.props.type[this.props.value]}>
                {
                    Object.values(this.props.type)
                        .filter(x => isNaN(parseInt(x)))
                        .map(val => 
                        {
                            return <option>{val}</option>;
                        })
                }
            </select>
        );
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value) {
          this.setState({value: this.props.value});
        }
    }


    handleChangeEvent(e: React.ChangeEvent<HTMLSelectElement>): void
    {
        e.preventDefault();
        e.stopPropagation();
        const value = this.props.type[e.target.value];
        this.setState({value: value});
        this.props.onChange(value);
    }

    preventDefault(e: React.MouseEvent<HTMLElement>): void
    {
        e.preventDefault();
        e.stopPropagation();
    }
}

interface EnumData<T>
{
    type: T;
    value: number;
    onChange: (val: number) => void;
}