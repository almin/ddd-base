// MIT © 2017 azu
import { Entity } from "../Entity";
import { RepositoryCore } from "./RepositoryCore";
import { MapLike } from "map-like";
import { RepositoryEventEmitter } from "./RepositoryEventEmitter";

/**
 * NullableRepository has not initial value.
 * In other word, NullableRepository#get may return undefined.
 */
export class NullableRepository<T extends Entity<any>> {
    private core: RepositoryCore<T["id"], T>;

    constructor() {
        this.core = new RepositoryCore(new MapLike());
    }

    get map(): MapLike<string, T> {
        return this.core.map;
    }

    get events(): RepositoryEventEmitter<T> {
        return this.core.events;
    }

    get(): T | undefined {
        return this.core.getLastSaved();
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
