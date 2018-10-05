import { Identifier } from "../Identifier";
import { EntityLikeProps } from "../EntityLike";
import { EntityLike } from "../EntityLike";
import { Constructor } from "../TypeUtil";

/**
 *
 * K is type of a key
 * T[K] is type of its value
 */
export type PartialMap<T> = { [K in keyof T]?: (prev: T[K]) => T[K] };

/**
 * Mixin Copyable to the BaseClass
 * @param BaseClass
 * @returns Copyable class
 * @example
 *
 * class A extends Copyable<Entity<EntityIdentifier>>{}
 *
 * @see https://github.com/Microsoft/TypeScript/issues/22431#issuecomment-371908767
 */
export const Copyable = <
    ConstructorClass extends Constructor<EntityLike<EntityLikeProps<Identifier<any>>>>,
    Entity extends InstanceType<ConstructorClass>,
    Props extends Entity["props"]
>(
    BaseClass: ConstructorClass
) => {
    return class extends BaseClass {
        /**
         * Return partial change of this object
         *
         * Example:
         * ```js
         * new Person({
         *   name "jack",
         *   age: 2
         * }).copy({age: 10})` is  `new Person({
         *   name: "jack",
         *   age: 10
         * })
         * ```
         */
        copy(partial: Partial<Props>): this {
            const newProps = Object.assign({}, this.props, partial);
            const Construct = this.constructor as any;
            return new Construct(newProps) as this;
        }

        /**
         * Return partial change of this object by using functions
         *
         * Example:
         * ```js
         * new Person({
         *   name "jack",
         *   age: 2
         * }).mapCopy({age: prev => prev+1})` is  `new Person({
         *   name: "jack",
         *   age: 3
         * })
         * ```
         */
        mapCopy(partial: PartialMap<Props>): this {
            const newProps: { [index: string]: any } = {};
            const oldInstance: { [index: string]: any } = this;
            Object.keys(this.props).forEach(key => {
                if (key in partial) {
                    newProps[key] = (partial as any)[key](oldInstance[key]);
                } else {
                    newProps[key] = oldInstance[key];
                }
            });
            const Construct = this.constructor as any;
            return new Construct(newProps) as this;
        }
    };
};
