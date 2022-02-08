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
                <input type="range" min={this.props.min} max={this.props.max} value={this.props.getVal()} onChange={this.handleChangeEvent}/>
                <span>{this.props.getVal()}</span>
            </div>
        );
    }

    handleChangeEvent(e: React.FormEvent<HTMLInputElement>): void
    {
        const element = (e.target as HTMLInputElement);
        this.props.setVal(element.valueAsNumber);
        this.setState({value: element.valueAsNumber});
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