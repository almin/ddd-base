import { shallowEqual } from "shallow-equal-object";

/**
 * Value object definition
 */
export class ValueObject<Props extends object> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
    }

    /**
     * Check equality by shallow equals of properties.
     * It can be override.
     */
    equals(object?: ValueObject<Props>): boolean {
        if (object == null || object == undefined) {
            return false;
        }
        if (object.props === undefined) {
            return false;
        }
        return shallowEqual(this.props, object.props);
    }
}
