// MIT © 2017 azu
import { Identifier } from "./Identifier";
import { EntityLike, EntityLikeProps } from "./EntityLike";

export const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

/**
 * Entity has readonly props.
 * It is created with Props and It has `props` property.
 * This entity has received through constructor.
 *
 * ## Why readonly props?
 *
 * If you want to modify props directory, you should define entity properties.
 *
 * Entity require `props` object as `super(props)`.
 * Also, you can define `this.name = props.name` as own property.
 *
 * This limitation ensure `props` value
 *
 * ```ts
 * class ShoppingCartItemIdentifier extends Identifier<string> {
 * }
 *
 *  interface ShoppingCartItemProps {
 *     id: ShoppingCartItemIdentifier;
 *     name: string;
 *     price: number;
 * }
 *
 *  class ShoppingCartItem extends Entity<ShoppingCartItemProps> implements ShoppingCartItemProps {
 *     id: ShoppingCartItemIdentifier;
 *     name: string;
 *     price: number;
 *
 *     constructor(props: ShoppingCartItemProps) {
 *         super(props);
 *         this.id = props.id;
 *         this.name = props.name;
 *         this.price = props.price;
 *     }
 * }
 * ```
 */
export class Entity<Props extends EntityLikeProps<Identifier<any>>> implements EntityLike<Props> {
    props: Readonly<Props>;

    constructor(props: Props) {
        this.props = Object.freeze(props);
    }

    /*
     * Check equality by identifier
     */
    equals(object?: Entity<Props>): boolean {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        if (!isEntity(object)) {
            return false;
        }
        return this.props.id.equals(object.props.id);
    }
}
