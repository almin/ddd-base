// MIT © 2017 azu
import { Entity } from "./Entity";
import { MapLike } from "map-like";
import { Identifier } from "./Identifier";

export class RepositoryCore<T extends Identifier<any>, P extends Entity<any>> {
    private map: MapLike<string, P>;
    private lastUsed: P | undefined;

    constructor() {
        this.map = new MapLike<string, P>();
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
    }

    delete(entity: P) {
        this.map.delete(String(entity.id.toValue()));
        if (this.lastUsed === entity) {
            delete this.lastUsed;
        }
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
        delete this.lastUsed;
        this.map.clear();
    }
}
