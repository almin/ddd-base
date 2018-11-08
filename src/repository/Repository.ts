import { EntityLike } from "../EntityLike";
import { MapLike } from "map-like";
import { RepositoryEventEmitter } from "./RepositoryEventEmitter";

export abstract class Repository<
    Entity extends EntityLike<any>,
    Props extends Entity["props"] = Entity["props"],
    Id extends Props["id"] = Props["id"]
> {
    abstract get map(): MapLike<string, Entity>;

    abstract get events(): RepositoryEventEmitter<Entity>;

    abstract get(): Entity | undefined;

    abstract getAll(): Entity[];

    abstract findById(entityId?: Id): Entity | undefined;

    abstract save(entity: Entity): void;

    abstract delete(entity: Entity): void;

    abstract clear(): void;
}
