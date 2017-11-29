// MIT © 2017 azu
import { Identifier } from "../src/Identifier";
import { Entity } from "../src/Entity";
import * as assert from "assert";

// Entity A
class AIdentifier extends Identifier<string> {}

class AEntity extends Entity<AIdentifier> {}

// Entity B
class BIdentifier extends Identifier<string> {}

class BEntity extends Entity<BIdentifier> {}

describe("Entity", () => {
    describe("id", () => {
        it("should return id", () => {
            const aIdentifier = new AIdentifier("a-id");
            const a1 = new AEntity(aIdentifier);
            assert.strictEqual(a1.id, aIdentifier);
        });
    });
    describe("#equals", () => {
        it("when has same id, should return true", () => {
            const a1 = new AEntity(new AIdentifier("a-id"));
            const a2 = new AEntity(new AIdentifier("a-id"));
            assert.ok(a1.equals(a2), "a1 === a2");
        });
        it("when has not same id, should return false", () => {
            const a1 = new AEntity(new AIdentifier("a1-id"));
            const a2 = new AEntity(new AIdentifier("a2-id"));
            assert.ok(!a1.equals(a2), "a1 !== a2");
        });
        it("A is not B", () => {
            const a = new AEntity(new AIdentifier("1"));
            const b = new BEntity(new BIdentifier("1"));
            assert.ok(!a.equals(b), "A is not B");
        });
    });
});
