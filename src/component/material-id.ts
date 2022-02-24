import { Utils } from "../common/utils";

export class MaterialId
{
    id: number;

    constructor(name: string)
    {
        this.id = Utils.hash(name);
    }
}