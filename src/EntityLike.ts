import { Identifier } from "./Identifier";

export interface EntityLikeProps<Id extends Identifier<any>> {
    id: Id;
    [index: string]: any;
}

export interface EntityLike<Props extends EntityLikeProps<Identifier<any>>> {
    props: Props;

    equals(object?: EntityLike<Props>): boolean;
}
