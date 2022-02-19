import { Engine, QueryBuilder } from "tick-knock";
import { ObjectType } from "../component/object-type";

export class QueryHolder
{
    static readonly sunQuery = new QueryBuilder().contains(ObjectType.SUN).build();
    static readonly cameraQuery = new QueryBuilder().contains(ObjectType.CAMERA).build();
    static readonly instanceQuery = new QueryBuilder().contains(ObjectType.INSTANCE).build();
    static readonly materialQuery = new QueryBuilder().contains(ObjectType.MATERIAL).build();

    private constructor()
    {
    }

    static addQueries(engine: Engine)
    {
        engine.addQuery(this.sunQuery);
        engine.addQuery(this.cameraQuery);
        engine.addQuery(this.instanceQuery);
        engine.addQuery(this.materialQuery);
    }
}