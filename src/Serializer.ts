// MIT © 2017 azu
export interface Serializer<Entity, JSON> {
    /**
     * Convert Entity to JSON format
     */
    toJSON(entity: Entity): JSON;

    /**
     * Convert JSON to Entity
     */
    fromJSON(json: JSON): Entity;
}
