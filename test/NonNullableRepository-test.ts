import * as assert from "assert";
import { Entity, Identifier, NonNullableRepository } from "../src";

describe("NonNullableRepository", () => {
    describe("#get", () => {
        it("should return last used entity", () => {
            class AIdentifier extends Identifier<string> {}

            interface AProps {
                id: AIdentifier;
            }

            class AEntity extends Entity<AProps> {}

            class ARepository extends NonNullableRepository<AEntity> {}

            const defaultEntity = new AEntity({
                id: new AIdentifier("a")
            });
            const aRepository = new ARepository(defaultEntity);
            assert.ok(aRepository.get().equals(defaultEntity));
        });
    });
});
