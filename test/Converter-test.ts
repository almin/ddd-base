import assert = require("assert");
import { createConverter, Entity, Identifier, ValueObject } from "../src";

// Entity A
class AIdentifier extends Identifier<string> {}

interface AProps {
    id: AIdentifier;
    a1: number;
    a2: string;
}

class AEntity extends Entity<AProps> {
    constructor(args: AProps) {
        super(args);
    }
}

interface AEntityJSON {
    id: string;
    a1: number;
    a2: string;
}

const AConverter = createConverter<AProps, AEntityJSON>(AEntity, {
    id: [prop => prop.toValue(), json => new AIdentifier(json)],
    a1: [prop => prop, json => json],
    a2: [prop => prop, json => json]
});

// ValueObject B
interface BValueProps {
    b1: number;
    b2: string;
}

class BValue extends ValueObject<BValueProps> {}

interface BValueJSON {
    b1: number;
    b2: string;
}

const BConverter = createConverter<BValueProps, BValueJSON>(BValue, {
    b1: [prop => prop, json => json],
    b2: [prop => prop, json => json]
});

// Parent has A and B
class ParentIdentifier extends Identifier<string> {}

interface ParentJSON {
    id: string;
    a: AEntityJSON;
    b: BValueJSON;
}

interface ParentProps {
    id: ParentIdentifier;
    a: AEntity;
    b: BValue;
}

class ParentEntity extends Entity<ParentProps> {}

const ParentConverter = createConverter<ParentProps, ParentJSON>(ParentEntity, {
    id: [prop => prop.toValue(), json => new ParentIdentifier(json)],
    a: AConverter,
    b: BConverter
});

describe("Converter", function() {
    it("should convert JSON <-> Entity", () => {
        const converter = createConverter<AProps, AEntityJSON>(AEntity, {
            id: [prop => prop.toValue(), json => new AIdentifier(json)],
            a1: [prop => prop, json => json],
            a2: [prop => prop, json => json]
        });
        const entity = new AEntity({
            id: new AIdentifier("a"),
            a1: 42,
            a2: "b prop"
        });
        const json = converter.toJSON(entity);
        assert.deepStrictEqual(json, {
            id: "a",
            a1: 42,
            a2: "b prop"
        });
        const entity2 = converter.fromJSON(json);
        assert.deepStrictEqual(entity, entity2);
    });
    it("should convert Props <-> Entity", () => {
        const entity = new AEntity({
            id: new AIdentifier("a"),
            a1: 42,
            a2: "b prop"
        });
        const json = AConverter.toJSON(entity);
        assert.deepStrictEqual(json, {
            id: "a",
            a1: 42,
            a2: "b prop"
        });
        const props = AConverter.JSONToProps(json);
        assert.deepStrictEqual(props, entity.props);
    });
    it("should convert JSON <-> ValueObject", () => {
        const value = new BValue({
            b1: 42,
            b2: "b prop"
        });
        const json = BConverter.toJSON(value);
        assert.deepStrictEqual(json, {
            b1: 42,
            b2: "b prop"
        });
        const value2 = BConverter.fromJSON(json);
        assert.deepStrictEqual(value, value2);
    });

    it("should convert by child Converter", () => {
        const a = new AEntity({
            id: new AIdentifier("a"),
            a1: 42,
            a2: "b prop"
        });
        const b = new BValue({
            b1: 42,
            b2: "b prop"
        });
        const parent = new ParentEntity({
            id: new ParentIdentifier("parent"),
            a,
            b
        });
        const parentJSON = ParentConverter.toJSON(parent);
        assert.deepStrictEqual(parentJSON, {
            id: "parent",
            a: {
                a1: 42,
                a2: "b prop",
                id: "a"
            },
            b: {
                b1: 42,
                b2: "b prop"
            }
        });
        const parent_2 = ParentConverter.fromJSON(parentJSON);
        assert.ok(parent.equals(parent_2));
        assert.deepStrictEqual(parent, parent_2);
        const parentJSON_2 = ParentConverter.propsToJSON(parent.props);
        assert.deepStrictEqual(parentJSON, parentJSON_2);
    });
});
