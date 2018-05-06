import { shallowEqual } from "shallow-equal-object";

export class ImmutableValueObject<Props extends object> {
    props: Readonly<Props>;
    constructor(props: Props) {
        this.props = Object.freeze(props);
    }
    /**
     * Check equality by shallow equals of properties.
     * It can be override.
     */
    equals(object?: ImmutableValueObject<{}>): boolean {
        return shallowEqual(this, object);
    }
}
