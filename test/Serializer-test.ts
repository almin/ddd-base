import { Identifier, Serializer } from "../src";
import { Entity } from "../src";
import * as assert from "assert";

describe("Serializer", () => {
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

    const ASerializer: Serializer<AEntity, AEntityJSON> = {
        fromJSON(json) {
            return new AEntity({
                id: new AIdentifier(json.id),
                a: json.a,
                b: json.b
            });
        },
        toJSON(entity) {
            return entity.toJSON();
        }
    };

    it("toJSON: Entity -> JSON", () => {
        const entity = new AEntity({
            id: new AIdentifier("a"),
            a: 42,
            b: "b prop"
        });
        const json = ASerializer.toJSON(entity);
        assert.deepStrictEqual(json, {
            id: "a",
            a: 42,
            b: "b prop"
        });
    });

    it("fromJSON: JSON -> Entity", () => {
        const entity = ASerializer.fromJSON({
            id: "a",
            a: 42,
            b: "b prop"
        });
        assert.ok(entity instanceof AEntity, "entity should be instanceof AEntity");
        assert.deepStrictEqual(
            ASerializer.toJSON(entity),
            {
                id: "a",
                a: 42,
                b: "b prop"
            },
            "JSON <-> Entity"
        );
    });
});
