import { Utils } from "../common/utils";

export class MaterialId
{
    private _id: number;

    constructor(name: string)
    {
        this.name = name;
    }

    get id()
    {
        return this._id;
    }

    set id(id: number)
    {
        this._id = id;
    }

    set name(name: String)
    {
        this._id = Utils.hash(name);
    }
}