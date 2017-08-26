// MIT © 2017 azu

import { shallowEqual } from "shallow-equal-object";

/**
 * Value object definition
 */
export abstract class ValueObject {
    /**
     * Check equality by shallow equals of properties.
     * It can be override.
     */
    equals(object?: ValueObject): boolean {
        return shallowEqual(this, object);
    }
}
