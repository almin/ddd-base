import { Entity } from "./Entity";
import { ValueObject, ValueObjectProps } from "./ValueObject";
import { EntityLikeProps } from "./EntityLike";
import { Identifier } from "./Identifier";
import { Constructor } from "./TypeUtil";

/**
 * If pass EntityProps, return Entity type
 * If pass ValueObjectProps, return ValueObject type
 */
type CreateEntityOrValueObject<
    Props extends EntityLikeProps<Identifier<any>> | ValueObjectProps
> = Props extends EntityLikeProps<Identifier<any>> ? Entity<Props> : ValueObject<Props>;
/**
 * Create convert that convert JSON <-> Props <-> Entity.
 * Limitation: Convert can be possible one for one converting.
 * @param EntityConstructor
 * @param mappingPropsAndJSON
 */
export const createConverter = <
    Props extends EntityLikeProps<Identifier<any>> | ValueObjectProps,
    JSON extends { [P in keyof Props]: any },
    T extends CreateEntityOrValueObject<Props> = CreateEntityOrValueObject<Props>,
    EntityConstructor extends Constructor<T> = Constructor<T>
>(
    EntityConstructor: EntityConstructor,
    mappingPropsAndJSON: { [P in keyof Props]: [(prop: Props[P]) => JSON[P], (json: JSON[P]) => Props[P]] }
) => {
    return {
        /**
         * Convert Entity|ValueObject to JSON format
         */
        toJSON(entity: T): JSON {
            const json: any = {};
            Object.keys(entity.props).forEach(key => {
                json[key] = mappingPropsAndJSON[key][0](entity.props[key]);
            });
            return json;
        },
        /**
         * Convert JSON to Props
         */
        JSONToProps(json: JSON): Props {
            const props: any = {};
            Object.keys(json).forEach(key => {
                props[key] = mappingPropsAndJSON[key][1]((json as any)[key]);
            });
            return props as Props;
        },
        /**
         * Convert JSON to Entity|ValueObject
         */
        fromJSON(json: JSON): T {
            const props: any = {};
            Object.keys(json).forEach(key => {
                props[key] = mappingPropsAndJSON[key][1]((json as any)[key]);
            });
            return new EntityConstructor(props as Props);
        }
    };
};
