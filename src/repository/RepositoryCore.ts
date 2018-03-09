// MIT © 2017 azu
import { Entity } from "../Entity";
import { MapLike } from "map-like";
import { Identifier } from "../Identifier";
import { RepositoryDeletedEvent, RepositoryEventEmitter, RepositorySavedEvent } from "./RepositoryEventEmitter";

/**
 * Repository Core implementation
 */
export class RepositoryCore<T extends Identifier<any>, P extends Entity<T>> {
    public readonly map: MapLike<string, P>;
    public readonly events: RepositoryEventEmitter<P>;
    private lastUsed: P | undefined;

    constructor(map: MapLike<string, P>) {
        this.map = map;
        this.events = new RepositoryEventEmitter<P>();
    }

    /**
     * Get last saved entity if exist.
     * This is useful on client-side implementation.
     * Because, client-side often access-user is a single user.
     */
    getLastSaved(): P | undefined {
        return this.lastUsed;
    }

    /**
     * Find a entity by `entityIdentifier` that is instance of Identifier class.
     * Return `undefined` if not found entity.
     */
    findById(entityIdentifier?: T): P | undefined {
        if (!entityIdentifier) {
            return;
        }
        return this.map.get(String(entityIdentifier.toValue()));
    }

    /**
     * Find all entity that `predicate(entity)` return true
     */
    findAll(predicate: (entity: P) => boolean): P[] {
        return this.map.values().filter(predicate);
    }

    /**
     * Get all entities
     */
    getAll(): P[] {
        return this.map.values();
    }

    /**
     * Save entity to the repository.
     */
    save(entity: P): void {
        this.lastUsed = entity;
        this.map.set(String(entity.id.toValue()), entity);
        this.events.emit(new RepositorySavedEvent(entity));
    }

    /**
     * Delete entity from the repository.
     */
    delete(entity: P) {
        this.map.delete(String(entity.id.toValue()));
        if (this.lastUsed === entity) {
            delete this.lastUsed;
        }
        this.events.emit(new RepositoryDeletedEvent(entity));
    }

    /**
     * Delete entity by `entityIdentifier` that is instance of Identifier class.
     */
    deleteById(entityIdentifier?: T) {
        if (!entityIdentifier) {
            return;
        }
        const entity = this.findById(entityIdentifier);
        if (entity) {
            this.delete(entity);
        }
    }

    /**
     * Clear all entity
     */
    clear(): void {
        this.map.forEach(entity => this.delete(entity));
    }
}
