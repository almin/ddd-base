// MIT © 2017 azu

import { shallowEqual } from "shallow-equal-object";

/**
 * Value object definition
 */
export abstract class ValueObject {
    equals(object?: ValueObject): boolean {
        return shallowEqual(this, object);
    }
}
