// Entity A
import { Entity, Identifier } from "../src";
import { Copyable } from "../src/mixin/Copyable";
import * as assert from "assert";

describe("Copyable", () => {
    it("should inherit Mixin CLass", () => {
        class AIdentifier extends Identifier<string> {}

        interface AProps {
            id: AIdentifier;
            value: string;
        }

        class AEntity extends Entity<AProps> {
            rootValue: string = "rootValue";
        }

        const aEntity = new AEntity({
            id: new AIdentifier("a"),
            value: "a"
        });
        assert.ok(aEntity instanceof AEntity);
        assert.strictEqual(aEntity.props.value, "a");
        assert.strictEqual(aEntity.rootValue, "rootValue");

        class CopyableEntity extends Copyable(AEntity) {
            cProps = "c";
        }

        const entity = new CopyableEntity({
            id: new AIdentifier("test"),
            value: "string"
        });
        assert.ok(entity instanceof CopyableEntity);
        assert.strictEqual(entity.props.value, "string");
        assert.strictEqual(entity.cProps, "c");
        assert.strictEqual(entity.rootValue, "rootValue");
        const newEntity = entity.copy({
            value: "new"
        });
        assert.ok(newEntity instanceof CopyableEntity);
        assert.strictEqual(newEntity.props.value, "new");
        assert.strictEqual(newEntity.cProps, "c");
        assert.strictEqual(newEntity.rootValue, "rootValue");
    });
    describe("#copy", () => {
        it("should copy prop partially", () => {
            class AIdentifier extends Identifier<string> {}

            interface AProps {
                id: AIdentifier;
                value: string;
            }

            class AEntity extends Entity<AProps> {}

            class CopyableEntity extends Copyable(AEntity) {}

            const entity = new CopyableEntity({
                id: new AIdentifier("test"),
                value: "string"
            });
            const newEntity = entity.copy({
                value: "new"
            });
            assert.strictEqual(newEntity.props.id, entity.props.id);
            assert.strictEqual(newEntity.props.value, "new");
        });
    });
    describe("#mapCopy", () => {
        it("should map and copy", () => {
            it("should copy prop partially", () => {
                class AIdentifier extends Identifier<string> {}

                interface AProps {
                    id: AIdentifier;
                    value: string;
                }

                class AEntity extends Entity<AProps> {}

                class CopyableEntity extends Copyable(AEntity) {}

                const entity = new CopyableEntity({
                    id: new AIdentifier("test"),
                    value: "string"
                });
                const newEntity = entity
                    .mapCopy({
                        value: prevValue => {
                            assert.strictEqual(prevValue, "value");
                            return "a";
                        }
                    })
                    .mapCopy({
                        value: prevValue => {
                            assert.strictEqual(prevValue, "a");
                            return "b";
                        }
                    });
                assert.strictEqual(newEntity.props.id, entity.props.id);
                assert.strictEqual(newEntity.props.value, "b");
            });
        });
    });
});
