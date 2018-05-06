import { shallowEqual } from "shallow-equal-object";

export class ReadonlyValueObject<Props extends object> {
    props: Readonly<Props>;
    constructor(props: Props) {
        this.props = Object.freeze(props);
    }
    /**
     * Check equality by shallow equals of properties.
     * It can be override.
     */
    equals(object?: ReadonlyValueObject<{}>): boolean {
        return shallowEqual(this.props, object);
    }
}
