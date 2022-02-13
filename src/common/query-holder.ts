import { Engine, QueryBuilder } from "tick-knock";
import { EntityTags } from "./entity-tags";

export class QueryHolder
{
    static readonly boxQuery = new QueryBuilder().contains(EntityTags.CUBE).build();
    static readonly sunQuery = new QueryBuilder().contains(EntityTags.SUN).build();
    static readonly cameraPerspectiveQuery = new QueryBuilder().contains(EntityTags.CAMERA_PERSPECTIVE).build();
    static readonly playerQuery = new QueryBuilder().contains(EntityTags.PLAYER).build();

    private constructor()
    {
    }

    static addQueries(engine: Engine)
    {
        engine.addQuery(this.boxQuery);
        engine.addQuery(this.sunQuery);
        engine.addQuery(this.cameraPerspectiveQuery);
        engine.addQuery(this.playerQuery);
    }
}