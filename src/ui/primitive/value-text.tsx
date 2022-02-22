import * as React from "react";

export class ValueComponent extends React.Component<ValueProps>
{
    constructor(props: ValueProps)
    {
        super(props);
    }

    render(): React.ReactNode 
    {
        return (
            <div>
                <span>{this.props.title}</span>
                <span>{this.props.getVal()}</span>
            </div>
        );
    }
}

interface ValueProps
{
    getVal: () => string;
    title: string;
}