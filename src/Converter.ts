import { Entity } from "./Entity";
import { ValueObject, ValueObjectProps } from "./ValueObject";
import { EntityLikeProps } from "./EntityLike";
import { Identifier } from "./Identifier";
import { Constructor } from "./TypeUtil";

/**
 * If pass EntityProps, return Entity type
 * If pass ValueObjectProps, return ValueObject type
 */
type CreateEntityOrValueObject<Props extends EntityLikeProps<any> | ValueObjectProps> = Props extends EntityLikeProps<
    any
>
    ? Entity<Props>
    : ValueObject<Props>;

export class Converter<
    Props extends EntityLikeProps<Identifier<any>> | ValueObjectProps,
    JSON extends { [P in keyof Props]: any },
    T extends CreateEntityOrValueObject<Props> = CreateEntityOrValueObject<Props>
> {
    private EntityConstructor: Constructor<T>;
    private mapping: {
        [P in keyof Props]:
            | [((prop: Props[P]) => JSON[P]), ((json: JSON[P]) => Props[P])]
            | Converter<Props[P]["props"], JSON[P], Props[P]>
    };

    constructor({
        EntityConstructor,
        mapping
    }: {
        EntityConstructor: Constructor<T>;
        mapping: {
            [P in keyof Props]:
                | [(prop: Props[P]) => JSON[P], (json: JSON[P]) => Props[P]]
                | Converter<Props[P]["props"], JSON[P], Props[P]>
        };
    }) {
        this.EntityConstructor = EntityConstructor;
        this.mapping = mapping;
    }

    /**
     * Convert Entity|ValueObject to JSON format
     */
    toJSON(entity: T): JSON {
        const json: any = {};
        Object.keys(entity.props).forEach(key => {
            const mappingItem = this.mapping[key];
            if (mappingItem instanceof Converter) {
                json[key] = mappingItem.toJSON(entity.props[key]);
            } else {
                json[key] = mappingItem[0](entity.props[key]);
            }
        });
        return json;
    }

    /**
     * Convert Props to JSON
     */
    propsToJSON(props: Props): JSON {
        const json: any = {};
        Object.keys(props).forEach(key => {
            const mappingItem = this.mapping[key];
            if (mappingItem instanceof Converter) {
                json[key] = mappingItem.toJSON(props[key]);
            } else {
                json[key] = mappingItem[0](props[key]);
            }
        });
        return json;
    }

    /**
     * Convert JSON to Props
     */
    JSONToProps(json: JSON): Props {
        const props: any = {};
        Object.keys(json).forEach(key => {
            const mappingItem = this.mapping[key];
            const jsonItem = (json as any)[key];
            if (mappingItem instanceof Converter) {
                props[key] = mappingItem.JSONToProps(jsonItem);
            } else {
                props[key] = mappingItem[1](jsonItem);
            }
        });
        return props as Props;
    }

    /**
     * Convert JSON to Entity|ValueObject
     */
    fromJSON(json: JSON): T {
        const props: any = {};
        Object.keys(json).forEach(key => {
            const mappingItem = this.mapping[key];
            const jsonItem = (json as any)[key];
            if (mappingItem instanceof Converter) {
                props[key] = mappingItem.fromJSON(jsonItem);
            } else {
                props[key] = mappingItem[1](jsonItem);
            }
        });
        return new this.EntityConstructor(props as Props);
    }
}

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
    // Props[P] => Entity or ValueObject
    // JSON[P] => json property
    // Props[P].props => Entity's props or ValueObject's props
    mappingPropsAndJSON: {
        [P in keyof Props]:
            | [(prop: Props[P]) => JSON[P], (json: JSON[P]) => Props[P]]
            | Converter<Props[P]["props"], JSON[P], Props[P]>
    }
) => {
    return new Converter<Props, JSON, T>({
        EntityConstructor,
        mapping: mappingPropsAndJSON
    });
};
