// MIT © 2017 azu
import { Entity } from "./Entity";
import { RepositoryCore } from "./RepositoryCore";

export class NonNullableRepository<T extends Entity<any>> {
    private core: RepositoryCore<T["id"], T>;

    constructor(protected initialEntity: T) {
        this.core = new RepositoryCore();
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
