// MIT © 2017 azu
import { Entity } from "./Entity";
import { RepositoryCore } from "./RepositoryCore";
import { MapLike } from "map-like";

/**
 * NonNullableRepository has initial value.
 * In other words, NonNullableRepository#get always return a value.
 */
export class NonNullableRepository<T extends Entity<any>> {
    private core: RepositoryCore<T["id"], T>;

    constructor(protected initialEntity: T) {
        this.core = new RepositoryCore(new MapLike());
    }

    get map(): MapLike<string, T> {
        return this.core.map;
    }

    get(): T {
        return this.core.getLastSaved() || this.initialEntity;
    }

    getAll(): T[] {
        return this.core.getAll();
    }

    findById(entityId?: T["id"]): T | undefined {
        return this.core.findById(entityId);
    }

    save(entity: T): void {
        this.core.save(entity);
    }

    delete(entity: T) {
        this.core.delete(entity);
    }

    clear(): void {
        this.core.clear();
    }
}
