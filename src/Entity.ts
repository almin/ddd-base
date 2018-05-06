// MIT © 2017 azu
import { Identifier } from "./Identifier";
import { EntityLike, EntityLikeProps } from "./EntityLike";

export const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};

export class Entity<Props extends EntityLikeProps<Identifier<any>>> implements EntityLike<Props> {
    props: Props;

    constructor(props: Props) {
        this.props = props;
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
