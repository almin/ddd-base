// MIT © 2017 azu
/**
 * Identifier for Entity
 *
 * ## Example
 *
 * ```ts
 * class MyEntityIdentifier extends Identifier<string>{}
 * ```
 */
export class Identifier<T> {
    constructor(private value: T) {
        this.value = value;
    }

    equals(id?: Identifier<T>): boolean {
        if (id === null || id === undefined) {
            return false;
        }
        if (!(id instanceof this.constructor)) {
            return false;
        }
        return id.toValue() === this.value;
    }

    toString() {
        const constructorName = this.constructor.name;
        return `${constructorName}(${String(this.value)})`;
    }

    /**
     * Return raw value of identifier
     */
    toValue(): T {
        return this.value;
    }
}
