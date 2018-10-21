import assert = require("assert");
import { Entity, ValueObject, Identifier, createConverter } from "../src";

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

// ValueObject B
// Entity A
interface BValueProps {
    a: number;
    b: string;
}

class BValue extends ValueObject<BValueProps> {}

interface BValueJSON {
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
        const json = converter.toJSON(entity);
        assert.deepStrictEqual(json, {
            id: "a",
            a: 42,
            b: "b prop"
        });
        const entity2 = converter.fromJSON(json);
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
        const json = converter.toJSON(entity);
        assert.deepStrictEqual(json, {
            id: "a",
            a: 42,
            b: "b prop"
        });
        const props = converter.JSONToProps(json);
        assert.deepStrictEqual(props, entity.props);
    });
    it("should convert JSON <-> ValueObject", () => {
        const converter = createConverter<BValueProps, BValueJSON>(BValue, {
            a: [prop => prop, json => json],
            b: [prop => prop, json => json]
        });
        const value = new BValue({
            a: 42,
            b: "b prop"
        });
        const json = converter.toJSON(value);
        assert.deepStrictEqual(json, {
            a: 42,
            b: "b prop"
        });
        const value2 = converter.fromJSON(json);
        assert.deepStrictEqual(value, value2);
    });
});
