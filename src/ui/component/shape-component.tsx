import * as React from "react";
import {Shape, ShapeType} from "../../component/shape";
import {EnumSelect} from "../primitive/enum-select";
import {PositionComponent} from "./position-component";
import {NumberInput} from "../primitive/number-input";

export class ShapeComponent extends React.Component<ShapeProps, {shapeType: ShapeType}>
{
    constructor(props: ShapeProps)
    {
        super(props);
        this.state = {shapeType: props.shape?.type};
        this.onChangeType = this.onChangeType.bind(this);
        this.onRadiusChange = this.onRadiusChange.bind(this);
    }

    onChangeType(shapeType: ShapeType)
    {
        this.setState({shapeType: shapeType});
        this.props.shape.type = shapeType;
    }

    onRadiusChange(radius: number)
    {
        this.props.shape.radius = radius;
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.shape !== this.props.shape)
        {
            this.setState({shapeType: this.props.shape?.type});
        }
    }

    render(): React.ReactNode
    {
        return (
            this.props.shape != undefined ?
                <div className="row mt-3">
                    <div className="col-md-2"><label className="form-label">Shape:</label></div>
                    <div className="col">
                        <div className="row">
                            <div className="col-md-2"><label className="form-label">Type:</label></div>
                            <div className="col">
                                <div className="input-group input-group-sm">
                                    <EnumSelect type={ShapeType} value={this.props.shape.type} onChange={this.onChangeType}/>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.shapeType == ShapeType.SPHERE ?
                                <div className="row mt-3">
                                    <div className="col-md-2"><label className="form-label">Radius:</label></div>
                                    <div className="col">
                                        <div className="input-group input-group-sm">
                                            <NumberInput value={this.props.shape.radius} onChange={this.onRadiusChange}/>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                        {
                            this.state.shapeType == ShapeType.BOX ?
                                <PositionComponent position={this.props.shape.v1} title={"Dimension:"}/>
                                : null
                        }
                        {
                            this.state.shapeType == ShapeType.CAPSULE ?
                                <div>
                                    <div className="row mt-3">
                                        <div className="col-md-2"><label className="form-label">Radius:</label></div>
                                        <div className="col">
                                            <div className="input-group input-group-sm">
                                                <NumberInput value={this.props.shape.radius} onChange={this.onRadiusChange}/>
                                            </div>
                                        </div>
                                    </div>
                                    <PositionComponent position={this.props.shape.v1} title={"Top:"}/>
                                    <PositionComponent position={this.props.shape.v2} title={"Bottom:"}/>
                                </div>
                                : null
                        }
                        {
                            this.state.shapeType == ShapeType.PLANE ?
                                <div>
                                    <div className="row mt-3">
                                        <div className="col-md-2"><label className="form-label">H:</label></div>
                                        <div className="col">
                                            <div className="input-group input-group-sm">
                                                <NumberInput value={this.props.shape.radius} onChange={this.onRadiusChange}/>
                                            </div>
                                        </div>
                                    </div>
                                    <PositionComponent position={this.props.shape.v1} title={"Direction:"}/>
                                </div>
                                : null
                        }
                        {
                            this.state.shapeType == ShapeType.TORUS ?
                                <div>
                                    <div className="row mt-3">
                                        <div className="col-md-2"><label className="form-label">Inner:</label></div>
                                        <div className="col">
                                            <div className="input-group input-group-sm">
                                                <NumberInput value={this.props.shape.v1.y} onChange={(val) => this.props.shape.v1.y = val}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-2"><label className="form-label">Outer:</label></div>
                                        <div className="col">
                                            <div className="input-group input-group-sm">
                                                <NumberInput value={this.props.shape.v1.x} onChange={(val) => this.props.shape.v1.x = val}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                </div>
                : null
        );
    }
}

interface ShapeProps
{
    shape?: Shape;
}