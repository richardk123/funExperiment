import * as React from "react";

export class SliderInput extends React.Component<InputData, {value: string}>
{
    constructor(props: InputData)
    {
        super(props);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.preventDefault = this.preventDefault.bind(this);
        this.state = {value: props.value?.toString()};
    }

    render(): React.ReactNode 
    {
        return (
            <input type="range" value={this.state.value} 
                min={this.props.min}
                max={this.props.max}
                step={this.props.step}
                className="form-range form-control slider"
                onChange={this.handleChangeEvent}
                onClick={this.preventDefault}/>
        );
    }

    componentDidUpdate(prevProps) {
        if(prevProps.value !== this.props.value) {
          this.setState({value: this.props.value?.toString()});
        }
    }


    handleChangeEvent(e: React.ChangeEvent<HTMLInputElement>): void
    {
        e.preventDefault();
        e.stopPropagation();
        this.setState({value: e.target.value});
        const value = parseFloat((e.target as HTMLInputElement).value);
        this.props.onChange(value);
    }

    preventDefault(e: React.MouseEvent<HTMLElement>): void
    {
        e.preventDefault();
        e.stopPropagation();
    }
}

interface InputData
{
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (val: number) => void;
}