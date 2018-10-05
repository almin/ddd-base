import assert = require("assert");
import { Entity, Identifier, createConverter } from "../src";

// Entity A
class AIdentifier extends Identifier<string> {}

interface AProps {
    id: AIdentifier;
    a: number;
    b: string;
}

class AEntity extends Entity<AProps> {
    constructor(args: AProps) {
        super(args);
    }

    toJSON(): AEntityJSON {
        return {
            id: this.props.id.toValue(),
            a: this.props.a,
            b: this.props.b
        };
    }
}

interface AEntityJSON {
    id: string;
    a: number;
    b: string;
}

describe("Converter", function() {
    it("should convert JSON <-> Entity", () => {
        const converter = createConverter<AProps, AEntityJSON>(AEntity, {
            id: [prop => prop.toValue(), json => new AIdentifier(json)],
            a: [prop => prop, json => json],
            b: [prop => prop, json => json]
        });
        const entity = new AEntity({
            id: new AIdentifier("a"),
            a: 42,
            b: "b prop"
        });
        const json = converter.entityToJSON(entity);
        assert.deepStrictEqual(json, {
            id: "a",
            a: 42,
            b: "b prop"
        });
        const entity2 = converter.jsonToEntity(json);
        assert.deepStrictEqual(entity, entity2);
    });
    it("should convert Props <-> Entity", () => {
        const converter = createConverter<AProps, AEntityJSON>(AEntity, {
            id: [prop => prop.toValue(), json => new AIdentifier(json)],
            a: [prop => prop, json => json],
            b: [prop => prop, json => json]
        });
        const entity = new AEntity({
            id: new AIdentifier("a"),
            a: 42,
            b: "b prop"
        });
        const json = converter.entityToJSON(entity);
        assert.deepStrictEqual(json, {
            id: "a",
            a: 42,
            b: "b prop"
        });
        const props = converter.jsonToProps(json);
        assert.deepStrictEqual(props, entity.props);
    });
});
