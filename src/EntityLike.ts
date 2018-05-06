import { ReadonlyEntity } from "./immutable/ImmutableEntity";
import { Identifier } from "./Identifier";

export const isEntityLike = (entity: any): entity is EntityLike<any> => {
    if (!entity) {
        return false;
    }
    return entity instanceof ReadonlyEntity;
};

export interface EntityLikeProps<Id extends Identifier<any>> {
    id: Id;
}

export interface EntityLike<Props extends EntityLikeProps<Identifier<any>>> {
    props: Props;

    equals(object?: EntityLike<Props>): boolean;
}
