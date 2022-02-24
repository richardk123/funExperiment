import * as React from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import Hue from "react-color/lib/components/hue/Hue";
import { Color } from "../../component/color";

export class ColorComponent extends React.Component<ColorProps, {r: number, b: number, g: number}>
{
    constructor(props: ColorProps)
    {
        super(props);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.state = this.transformColor();
    }

    handleChangeComplete(color: ColorResult, event: React.ChangeEvent<HTMLInputElement>): void
    {
        this.props.color.r = color.rgb.r / 255;
        this.props.color.g = color.rgb.g / 255;
        this.props.color.b = color.rgb.b / 255;
        this.setState(color.rgb);
    }

    transformColor(): RGBColor
    {
        return {r: this.props.color?.r * 255, g: this.props.color?.g * 255, b: this.props.color?.b * 255};
    }

    render(): React.ReactNode 
    {
        return (
            this.props.color !== undefined ?
                <Hue className="color" color={ this.transformColor() } onChange={ this.handleChangeComplete } />
            : null
        );
    }
}

interface ColorProps
{
    color?: Color;
}