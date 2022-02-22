import { Engine, Entity } from "tick-knock";
import { V3 } from "../component/base/v3";
import { Color } from "../component/color";
import { MaterialId } from "../component/material-id";
import { Modifier, ModifierType } from "../component/modifier";
import { Name } from "../component/name";
import { ObjectType } from "../component/object-type";
import { Position } from "../component/position";
import { Reflection } from "../component/reflection";
import { Rotation } from "../component/rotation";
import { Shape, ShapeType } from "../component/shape";

export class Scene
{
    private _engine: Engine;

    constructor(engine: Engine)
    {
        this._engine = engine;
    }

    public addInstance(name: string, position: Position, materialName: string): InstanceBuilder
    {
        return new InstanceBuilder(this._engine, position, this, materialName, name);
    }

    public addMaterial(materialName: string, color: Color, reflection: number)
    {
        const entity = new Entity();
        entity.add(new MaterialId(materialName));
        entity.add(new Name("material-" + materialName))
        entity.add(color);
        entity.add(new Reflection(reflection))
        entity.add(ObjectType.MATERIAL);
        this._engine.addEntity(entity);
    }
}

export class InstanceBuilder
{
    private _engine: Engine;
    private _entity: Entity;
    private _scene: Scene;

    constructor(engine: Engine, position: Position, scene: Scene, materialName: string, name: string)
    {
        this._engine = engine;
        this._entity = new Entity();
        this._entity.add(position);
        this._entity.add(new Name(name));
        this._entity.add(ObjectType.INSTANCE);
        this._entity.add(new Modifier(ModifierType.EXACT));
        this._entity.add(new MaterialId(materialName))
        this._scene = scene;
    }

    public setRotation(rotation: Rotation): InstanceBuilder
    {
        this._entity.add(rotation);
        return this;
    }

    public setModifier(modifier: Modifier): InstanceBuilder
    {
        this._entity.add(modifier);
        return this;
    }

    public createAsCubeShape(dimension: V3): Scene
    {
        this._entity.add(new Shape(ShapeType.BOX, 0, dimension));
        this._engine.addEntity(this._entity);
        return this._scene;
    }

    public createAsSphereShape(radius: number): Scene
    {
        this._entity.add(new Shape(ShapeType.SPHERE, radius, new V3(0, 0, 0)));
        this._engine.addEntity(this._entity);
        return this._scene;
    }
}
