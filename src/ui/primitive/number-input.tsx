import * as React from "react";

export class NumberInput extends React.Component<InputData, {value: string}>
{
    constructor(props: InputData)
    {
        super(props);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.state = {value: props.value?.toString()};
    }

    render(): React.ReactNode 
    {
        return (
            <input type="text" value={this.state.value} 
                className="form-control"
                onChange={this.handleChangeEvent}
                onKeyPress={this.handleEnter}/>
        );
    }

    componentDidUpdate(prevProps) 
    {
        if(prevProps.value !== this.props.value) 
        {
          this.setState({value: this.props.value?.toString()});
        }
    }

    handleEnter(e: React.KeyboardEvent<HTMLInputElement>): void
    {
        if (e.key === 'Enter') 
        {
            const value = parseFloat((e.target as HTMLInputElement).value);
            this.setState({value: value.toString()});
            this.props.onChange(value);
        }
    }

    handleChangeEvent(e: React.ChangeEvent<HTMLInputElement>): void
    {
        this.setState({value: e.target.value});
    }
}

interface InputData
{
    value: number;
    onChange: (val: number) => void;
}