// MIT © 2017 azu
import { MapLike } from "map-like";
import { RepositoryDeletedEvent, RepositoryEventEmitter, RepositorySavedEvent } from "./RepositoryEventEmitter";
import { EntityLike } from "../EntityLike";

/**
 * Repository Core implementation
 */
export class RepositoryCore<
    Entity extends EntityLike<any>,
    Props extends Entity["props"] = Entity["props"],
    Id extends Props["id"] = Props["id"]
> {
    public readonly map: MapLike<string, Entity>;
    public readonly events: RepositoryEventEmitter<Entity>;
    private lastUsed: Entity | undefined;

    constructor(map: MapLike<string, Entity>) {
        this.map = map;
        this.events = new RepositoryEventEmitter<Entity>();
    }

    /**
     * Get last saved entity if exist.
     * This is useful on client-side implementation.
     * Because, client-side often access-user is a single user.
     */
    getLastSaved(): Entity | undefined {
        return this.lastUsed;
    }

    /**
     * Find a entity by `entityIdentifier` that is instance of Identifier class.
     * Return `undefined` if not found entity.
     */
    findById(entityIdentifier?: Id): Entity | undefined {
        if (!entityIdentifier) {
            return;
        }
        return this.map.get(String(entityIdentifier.toValue()));
    }

    /**
     * Find all entity that `predicate(entity)` return true
     */
    findAll(predicate: (entity: Entity) => boolean): Entity[] {
        return this.map.values().filter(predicate);
    }

    /**
     * Get all entities
     */
    getAll(): Entity[] {
        return this.map.values();
    }

    /**
     * Save entity to the repository.
     */
    save(entity: Entity): void {
        this.lastUsed = entity;
        this.map.set(String(entity.props.id.toValue()), entity);
        this.events.emit(new RepositorySavedEvent(entity));
    }

    /**
     * Delete entity from the repository.
     */
    delete(entity: Entity) {
        this.map.delete(String(entity.props.id.toValue()));
        if (this.lastUsed === entity) {
            delete this.lastUsed;
        }
        this.events.emit(new RepositoryDeletedEvent(entity));
    }

    /**
     * Delete entity by `entityIdentifier` that is instance of Identifier class.
     */
    deleteById(entityIdentifier?: Id) {
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
