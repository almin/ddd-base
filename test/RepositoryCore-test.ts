// MIT © 2017 azu
import { Entity } from "../src/Entity";
import { Identifier } from "../src/Identifier";
import { RepositoryCore } from "../src/repository/RepositoryCore";
import * as assert from "assert";
import { MapLike } from "map-like";
import { RepositoryDeletedEvent, RepositorySavedEvent } from "../src/repository/RepositoryEventEmitter";

class AIdentifier extends Identifier<string> {}

class AEntity extends Entity<AIdentifier> {}

describe("RepositoryCore", () => {
    describe("getLastSave", () => {
        it("should return lastSaved entity", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            assert.strictEqual(repository.getLastSaved(), undefined, "return null by default");
            // save entity
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            assert.strictEqual(repository.getLastSaved(), entity, "return entity that is saved at last");
            // delete
            repository.delete(entity);
            assert.strictEqual(repository.getLastSaved(), undefined, "return null again");
        });
    });
    describe("findById", () => {
        it("should return entity", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            // hit same id
            assert.strictEqual(repository.findById(entity.id), entity);
        });
        it("when not found, should return undefined", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            // hit same id
            assert.strictEqual(repository.findById(entity.id), undefined);
        });
    });
    describe("findAll", () => {
        it("predicate receive entity", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            repository.findAll(entity => {
                assert.ok(entity instanceof AEntity);
                return true;
            });
        });
        it("should return entities", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            assert.deepStrictEqual(repository.findAll(() => true), [entity]);
        });
        it("when not found, should return empty array", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            assert.deepStrictEqual(repository.findAll(() => false), []);
        });
    });
    describe("getAll", () => {
        it("should return all entity", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            assert.deepStrictEqual(repository.getAll(), [entity]);
        });
    });
    describe("delete", () => {
        it("delete entity, it to be not found", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            // delete
            repository.delete(entity);
            // not found
            assert.strictEqual(repository.findById(entity.id), undefined);
        });
    });
    describe("deleteById", () => {
        it("should delete by id", () => {
            it("delete entity, it to be not found", () => {
                const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
                const entity = new AEntity(new AIdentifier("a"));
                repository.save(entity);
                // delete
                repository.deleteById(entity.id);
                // not found
                assert.strictEqual(repository.findById(entity.id), undefined);
            });
        });
    });
    describe("clear", () => {
        it("should clear all entity", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            repository.save(entity);
            repository.save(entity);
            repository.save(entity);
            assert.ok(repository.getAll().length > 0);
            repository.clear();
            assert.ok(repository.getAll().length === 0, "should be cleared");
        });
    });
    describe("events", () => {
        it("should emit Events", () => {
            const repository = new RepositoryCore<AIdentifier, AEntity>(new MapLike());
            const entity = new AEntity(new AIdentifier("a"));
            let count = 0;
            repository.events.onSave(event => {
                count++;
                assert.ok(event instanceof RepositorySavedEvent);
                assert.strictEqual(event.entity, entity);
            });
            repository.events.onDelete(event => {
                count++;
                assert.ok(event instanceof RepositoryDeletedEvent);
                assert.strictEqual(event.entity, entity);
            });
            repository.save(entity);
            repository.delete(entity);
            assert.strictEqual(count, 2);
        });
    });
});
