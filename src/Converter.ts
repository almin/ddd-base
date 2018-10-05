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
    EntityProps extends EntityLikeProps<Identifier<any>>,
    EntityJSON extends { [P in keyof EntityProps]: any },
    T extends Entity<EntityProps> = Entity<EntityProps>,
    EntityConstructor extends Constructor<T> = Constructor<T>
>(
    EntityConstructor: EntityConstructor,
    mappingPropsAndJSON: {
        [P in keyof EntityProps]: [(prop: EntityProps[P]) => EntityJSON[P], (json: EntityJSON[P]) => EntityProps[P]]
    }
) => {
    return {
        /**
         * Convert Entity to JSON format
         */
        entityToJSON(entity: T): EntityJSON {
            const json: any = {};
            Object.keys(entity.props).forEach(key => {
                json[key] = mappingPropsAndJSON[key][0](entity.props[key]);
            });
            return json;
        },
        /**
         * Convert Entity to Props
         */
        entityToProps(entity: T): EntityProps {
            return entity.props;
        },
        /**
         * Convert JSON to Props
         */
        jsonToProps(json: EntityJSON): EntityProps {
            const props: any = {};
            Object.keys(json).forEach(key => {
                props[key] = mappingPropsAndJSON[key][1]((json as any)[key]);
            });
            return props as EntityProps;
        },
        /**
         * Convert JSON to Entity
         */
        jsonToEntity(json: EntityJSON): T {
            const props: any = {};
            Object.keys(json).forEach(key => {
                props[key] = mappingPropsAndJSON[key][1]((json as any)[key]);
            });
            return new EntityConstructor(props as EntityProps);
        }
    };
};
