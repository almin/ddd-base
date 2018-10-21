import { shallowEqual } from "shallow-equal-object";

export interface ValueObjectProps {
    [index: string]: any;
}

/**
 * Value object definition.
 * props is readonly by design.
 */
export class ValueObject<Props extends ValueObjectProps> {
    props: Readonly<Props>;

    constructor(props: Props) {
        this.props = Object.freeze(props);
    }

    /**
     * Check equality by shallow equals of properties.
     * It can be override.
     */
    equals(object?: ValueObject<Props>): boolean {
        if (object === null || object === undefined) {
            return false;
        }
        if (object.props === undefined) {
            return false;
        }
        return shallowEqual(this.props, object.props);
    }
}
