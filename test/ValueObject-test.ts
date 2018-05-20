import * as assert from "assert";
import { ValueObject } from "../src";

type XProps = { value: number };

class XValue extends ValueObject<XProps> {
    constructor(props: XProps) {
        super(props);
    }
}

describe("ValueObject", () => {
    describe("#equals", () => {
        it("when has same id, should return true", () => {
            const x1 = new XValue({
                value: 42
            });
            const x2 = new XValue({
                value: 42
            });
            assert.ok(x1.equals(x2), "x1 === x2");
        });
        it("when has not same id, should return false", () => {
            const x1 = new XValue({
                value: 2
            });
            const x2 = new XValue({
                value: 4
            });
            const x3 = {
                value: 4
            };
            assert.ok(!x1.equals(x2), "x1 !== x2");
            assert.ok(!x1.equals(x3 as any), "x1 !== x3");
        });
    });
});
