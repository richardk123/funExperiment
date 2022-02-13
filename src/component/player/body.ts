import { V3 } from "../base/v3";

export class Body
{
    private _bodyPositions: ReadonlyArray<V3>;

    constructor(bodyPositions: ReadonlyArray<V3>)
    {
        this._bodyPositions = bodyPositions;
    }

    get bodyPositions(): ReadonlyArray<V3>
    {
        return this._bodyPositions;
    }
}