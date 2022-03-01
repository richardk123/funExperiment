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
import {QueryHolder} from "./query-holder";

export class Scene
{
    private _engine: Engine;

    private static _scene: Scene;

    private constructor()
    {
        this._engine = new Engine();
        QueryHolder.addQueries(this._engine);
    }

    public static get(): Scene
    {
        if (this._scene == undefined)
        {
            this._scene = new Scene();
        }

        return this._scene;
    }

    public remove(entity: Entity)
    {
        this._engine.removeEntity(entity);
    }

    public addInstance(name: string, position: Position, materialName: string): InstanceBuilder
    {
        return new InstanceBuilder(this._engine, position, this, materialName, name);
    }

    public addMaterial(materialName: string, color: Color, reflection: number): Entity
    {
        const entity = new Entity();
        entity.add(new MaterialId(materialName));
        entity.add(new Name("material-" + materialName))
        entity.add(color);
        entity.add(new Reflection(reflection))
        entity.add(ObjectType.MATERIAL);
        this._engine.addEntity(entity);
        return entity;
    }

    public get engine()
    {
        return this._engine;
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

    public createAsCube(dimension: V3): Entity
    {
        this._entity.add(new Shape(ShapeType.BOX, 0, dimension));
        this._engine.addEntity(this._entity);
        return this._entity;
    }

    public createAsCapsule(v1: V3, v2: V3, radius: number): Entity
    {
        this._entity.add(new Shape(ShapeType.CAPSULE, radius, v1, v2));
        this._engine.addEntity(this._entity);
        return this._entity;
    }

    public createAsPlane(direction: V3, h: number): Entity
    {
        this._entity.add(new Shape(ShapeType.PLANE, h, direction));
        this._engine.addEntity(this._entity);
        return this._entity;
    }

    public createAsTorus(inner: number, outer: number): Entity
    {
        this._entity.add(new Shape(ShapeType.TORUS, 0, new V3(outer, inner, 0)));
        this._engine.addEntity(this._entity);
        return this._entity;
    }

    public createAsSphere(radius: number): Entity
    {
        this._entity.add(new Shape(ShapeType.SPHERE, radius));
        this._engine.addEntity(this._entity);
        return this._entity;
    }
}
