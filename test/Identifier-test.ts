import { Identifier } from "../src/Identifier";
import * as assert from "assert";

class AIdentifier extends Identifier<string> {}

class BIdentifier extends Identifier<string> {}

describe("Identifier", () => {
    describe("#equals", () => {
        it("When Same Type and Same Value, return true", () => {
            const aId = new AIdentifier("id");
            const bId = new AIdentifier("id");
            assert.ok(aId.equals(bId), "a === b");
        });
        it("When Same Type and Difference Value, return false", () => {
            const aId = new AIdentifier("a");
            const bId = new AIdentifier("b");
            assert.ok(!aId.equals(bId), "a !== b");
        });

        it("When Difference Type and Same Value, return false", () => {
            const aId = new AIdentifier("id");
            const bId = new BIdentifier("id");
            assert.ok(!aId.equals(bId), "a !== b");
        });
    });
    describe("#toString", () => {
        it("return human readable string", () => {
            const aId = new AIdentifier("id");
            assert.strictEqual(aId.toString(), "AIdentifier(id)");
        });
    });
    describe("#toValue", () => {
        it("return raw string", () => {
            const aId = new AIdentifier("id");
            assert.strictEqual(aId.toValue(), "id");
        });
    });
});
