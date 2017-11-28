import * as assert from "assert";
import { ValueObject } from "../src";

class XValue extends ValueObject {
    constructor(public x: number) {
        super();
    }
}

describe("ValueObject", () => {
    describe("#equals", () => {
        it("when has same id, should return true", () => {
            const x1 = new XValue(42);
            const x2 = new XValue(42);
            assert.ok(x1.equals(x2), "x1 === x2");
        });
        it("when has not same id, should return false", () => {
            const x1 = new XValue(2);
            const x2 = new XValue(4);
            assert.ok(!x1.equals(x2), "x1 !== x2");
        });
    });
});
