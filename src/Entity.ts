// MIT © 2017 azu
import { Identifier } from "./Identifier";

export abstract class Entity<Id extends Identifier<any>> {
    public readonly id: Id;

    constructor(id: Id) {
        this.id = id;
    }

    equals(object?: Entity<Id>): boolean {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        return this.id.equals(object.id);
    }
}
