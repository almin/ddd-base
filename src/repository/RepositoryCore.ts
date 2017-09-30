// MIT © 2017 azu
import { Entity } from "../Entity";
import { MapLike } from "map-like";
import { Identifier } from "../Identifier";
import { RepositoryDeletedEvent, RepositoryEventEmitter, RepositorySavedEvent } from "./RepositoryEventEmitter";

export class RepositoryCore<T extends Identifier<any>, P extends Entity<any>> {
    public readonly map: MapLike<string, P>;
    public readonly events: RepositoryEventEmitter;
    private lastUsed: P | undefined;

    constructor(map: MapLike<string, P>) {
        this.map = map;
        this.events = new RepositoryEventEmitter();
    }

    getLastSaved(): P | undefined {
        return this.lastUsed;
    }

    findById(entityId?: T): P | undefined {
        if (!entityId) {
            return;
        }
        return this.map.get(String(entityId.toValue()));
    }

    getAll(): P[] {
        return this.map.values();
    }

    save(entity: P): void {
        this.lastUsed = entity;
        this.map.set(String(entity.id.toValue()), entity);
        this.events.emit(new RepositorySavedEvent(entity));
    }

    delete(entity: P) {
        this.map.delete(String(entity.id.toValue()));
        if (this.lastUsed === entity) {
            delete this.lastUsed;
        }
        this.events.emit(new RepositoryDeletedEvent(entity));
    }

    deleteById(entityId?: T) {
        if (!entityId) {
            return;
        }
        const entity = this.findById(entityId);
        if (entity) {
            this.delete(entity);
        }
    }

    clear(): void {
        this.map.forEach(entity => this.delete(entity));
    }
}
