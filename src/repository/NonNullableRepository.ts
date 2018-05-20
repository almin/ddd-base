// MIT © 2017 azu
import { RepositoryCore } from "./RepositoryCore";
import { MapLike } from "map-like";
import { RepositoryEventEmitter } from "./RepositoryEventEmitter";
import { EntityLike } from "../EntityLike";

/**
 * NonNullableRepository has initial value.
 * In other words, NonNullableRepository#get always return a value.
 */
export class NonNullableRepository<
    Entity extends EntityLike<any>,
    Props extends Entity["props"] = Entity["props"],
    Id extends Props["id"] = Props["id"]
> {
    private core: RepositoryCore<Entity, Props, Id>;

    constructor(protected initialEntity: Entity) {
        this.core = new RepositoryCore(new MapLike<string, Entity>());
    }

    get map(): MapLike<string, Entity> {
        return this.core.map;
    }

    get events(): RepositoryEventEmitter<Entity> {
        return this.core.events;
    }

    get(): Entity {
        return this.core.getLastSaved() || this.initialEntity;
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
