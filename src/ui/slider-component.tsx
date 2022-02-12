import * as React from "react";

export class SliderComponent extends React.Component<SliderProps>
{
    constructor(props: SliderProps)
    {
        super(props);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.state = {value: 0};
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                <span>{this.props.title}</span>
                <input type="range" min={this.props.min} max={this.props.max} value={this.props.getVal()} step="0.25" onChange={this.handleChangeEvent}/>
                <div style={{color: 'blue', width: '50px', float: 'right'}}>{this.props.getVal()}</div>
            </div>
        );
    }

    handleChangeEvent(e: React.FormEvent<HTMLInputElement>): void
    {
        const element = (e.target as HTMLInputElement);
        const value = element.valueAsNumber;
        this.props.setVal(value);
        this.setState({value: value});
    }
}

interface SliderProps
{
    getVal: () => number;
    setVal: (val: number) => void;
    min: number;
    max: number;
    title: string;
}