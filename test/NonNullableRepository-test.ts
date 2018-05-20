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

            const aRepository = new ARepository(
                new AEntity({
                    id: new AIdentifier("a")
                })
            );
            assert.strictEqual(aRepository.get(), aRepository);
        });
    });
});
