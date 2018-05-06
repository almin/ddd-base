// MIT © 2017 azu
import { RepositoryCore } from "./RepositoryCore";
import { MapLike } from "map-like";
import { RepositoryEventEmitter } from "./RepositoryEventEmitter";
import { EntityLike } from "../EntityLike";

/**
 * NullableRepository has not initial value.
 * In other word, NullableRepository#get may return undefined.
 */
export class NullableRepository<Entity extends EntityLike<any>, Props extends Entity["props"], Id extends Props["id"]> {
    private core: RepositoryCore<Entity, Props, Id>;

    constructor() {
        this.core = new RepositoryCore(new MapLike());
    }

    get map(): MapLike<string, Entity> {
        return this.core.map;
    }

    get events(): RepositoryEventEmitter<Entity> {
        return this.core.events;
    }

    get(): Entity | undefined {
        return this.core.getLastSaved();
    }

    getAll(): Entity[] {
        return this.core.getAll();
    }

    findById(entityId?: Id): Entity | undefined {
        return this.core.findById(entityId);
    }

    save(entity: Entity): void {
        this.core.save(entity);
    }

    delete(entity: Entity) {
        this.core.delete(entity);
    }

    clear(): void {
        this.core.clear();
    }
}
