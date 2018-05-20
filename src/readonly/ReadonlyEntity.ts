import { Identifier } from "../Identifier";
import { EntityLike, EntityLikeProps } from "../EntityLike";

export const isReadonlyEntity = (entity: any): entity is ReadonlyEntity<{ id: Identifier<any> }> => {
    if (!entity) {
        return false;
    }
    return entity instanceof ReadonlyEntity;
};

/**
 * ReadonlyEntity has readonly props.
 * It is created with Props and It has `props` property.
 * This entity has received through constructor.
 *
 * @see https://www.quora.com/Why-did-React-use-props-as-an-abbreviation-for-property-properties
 */
export class ReadonlyEntity<Props extends EntityLikeProps<Identifier<any>>> implements EntityLike<Props> {
    props: Readonly<Props>;

    constructor(props: Props) {
        this.props = Object.freeze(props);
    }

    /*
     * Check equality by identifier
     */
    equals(object?: ReadonlyEntity<Props>): boolean {
        if (object == null || object == undefined) {
            return false;
        }
        if (this === object) {
            return true;
        }
        if (!isReadonlyEntity(object)) {
            return false;
        }
        return this.props.id.equals(object.props.id);
    }
}
