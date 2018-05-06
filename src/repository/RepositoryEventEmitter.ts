// MIT © 2017 azu
import { EventEmitter } from "events";
import { Entity } from "../Entity";
import { EntityLike } from "../EntityLike";

const SAVE = "SAVE";
const DELETE = "DELETE";

export class RepositorySavedEvent<T> {
    readonly type = SAVE;

    constructor(public entity: T) {}
}

export class RepositoryDeletedEvent<T> {
    readonly type = DELETE;

    constructor(public entity: T) {}
}

export type RepositoryEvents<T = Entity<any>> = RepositorySavedEvent<T> | RepositoryDeletedEvent<T>;

export class RepositoryEventEmitter<T extends EntityLike<any>> {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
        // disable EventEmitter Warning
        this.eventEmitter.setMaxListeners(0);
    }

    emit(event: RepositoryEvents<T>) {
        this.eventEmitter.emit(event.type, event);
    }

    onChange(handler: (event: RepositoryEvents<T>) => void): () => void {
        const releaseHandlers = [this.onSave(handler), this.onDelete(handler)];
        return () => {
            releaseHandlers.forEach(event => {
                event();
            });
        };
    }

    onSave(handler: (event: RepositorySavedEvent<T>) => void): () => void {
        this.eventEmitter.on(SAVE, handler);
        return () => {
            return this.eventEmitter.removeListener(SAVE, handler);
        };
    }

    onDelete(handler: (event: RepositoryDeletedEvent<T>) => void): () => void {
        this.eventEmitter.on(DELETE, handler);
        return () => {
            return this.eventEmitter.removeListener(DELETE, handler);
        };
    }

    clear() {
        return this.eventEmitter.removeAllListeners();
    }
}
