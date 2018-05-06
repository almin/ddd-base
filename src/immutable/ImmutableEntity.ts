// MIT © 2017 azu
import { Identifier } from "../Identifier";
import { EntityLike, EntityLikeProps } from "../EntityLike";

export const isImmutableEntity = (entity: any): entity is ImmutableEntity<{ id: Identifier<any> }> => {
    if (!entity) {
        return false;
    }
    return entity instanceof ImmutableEntity;
};

/**
 * ImmutableEntity is readonly Entity.
 * It is created with Props and It has `props` property.
 * This entity has received through constructor.
 *
 * @see https://www.quora.com/Why-did-React-use-props-as-an-abbreviation-for-property-properties
 */
export class ImmutableEntity<Props extends EntityLikeProps<Identifier<any>>> implements EntityLike<Props> {
    props: Readonly<Props>;

    constructor(props: Props) {
        this.props = Object.freeze(props);
    }

    /*
     * Check equality by identifier
     */
    equals(object?: ImmutableEntity<Props>): boolean {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        if (!isImmutableEntity(object)) {
            return false;
        }
        return this.props.id.equals(object.props.id);
    }
}
