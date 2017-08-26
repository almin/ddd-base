// MIT © 2017 azu
export interface Serializer<Entity, JSON> {
    toJSON(entity: Entity): JSON;

    fromJSON(json: JSON): Entity;
}
