import { Entity } from "./Entity";
import { EntityLikeProps } from "./EntityLike";
import { Identifier } from "./Identifier";
import { Constructor } from "./TypeUtil";

/**
 * Create convert that convert JSON <-> Props <-> Entity.
 * Limitation: Convert can be possible one for one converting.
 * @param EntityConstructor
 * @param mappingPropsAndJSON
 */
export const createConverter = <
    Props extends EntityLikeProps<Identifier<any>>,
    JSON extends { [P in keyof Props]: any },
    T extends Entity<Props> = Entity<Props>,
    EntityConstructor extends Constructor<T> = Constructor<T>
>(
    EntityConstructor: EntityConstructor,
    mappingPropsAndJSON: { [P in keyof Props]: [(prop: Props[P]) => JSON[P], (json: JSON[P]) => Props[P]] }
) => {
    return {
        /**
         * Convert Entity to JSON format
         */
        entityToJSON(entity: T): JSON {
            const json: any = {};
            Object.keys(entity.props).forEach(key => {
                json[key] = mappingPropsAndJSON[key][0](entity.props[key]);
            });
            return json;
        },
        /**
         * Convert Entity to Props
         */
        entityToProps(entity: T): Props {
            return entity.props;
        },
        /**
         * Convert JSON to Props
         */
        jsonToProps(json: JSON): Props {
            const props: any = {};
            Object.keys(json).forEach(key => {
                props[key] = mappingPropsAndJSON[key][1]((json as any)[key]);
            });
            return props as Props;
        },
        /**
         * Convert JSON to Entity
         */
        jsonToEntity(json: JSON): T {
            const props: any = {};
            Object.keys(json).forEach(key => {
                props[key] = mappingPropsAndJSON[key][1]((json as any)[key]);
            });
            return new EntityConstructor(props as Props);
        }
    };
};
