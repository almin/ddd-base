// MIT © 2017 azu
import { EventEmitter } from "events";
import { Entity } from "../Entity";

const SAVE = "SAVE";
const DELETE = "DELETE";

export class RepositorySavedEvent {
    readonly type = SAVE;

    constructor(public entity: Entity<any>) {}
}

export class RepositoryDeletedEvent {
    readonly type = DELETE;

    constructor(public entity: Entity<any>) {}
}

export type RepositoryEvents = RepositorySavedEvent | RepositoryDeletedEvent;

export class RepositoryEventEmitter {
    private eventEmitter: EventEmitter;

    constructor() {
        this.eventEmitter = new EventEmitter();
        // disable EventEmitter Warning
        this.eventEmitter.setMaxListeners(0);
    }

    emit(event: RepositoryEvents) {
        this.eventEmitter.emit(event.type, event);
    }

    onSave(handler: (event: RepositorySavedEvent) => void): () => void {
        this.eventEmitter.on(SAVE, handler);
        return () => {
            return this.eventEmitter.removeListener(SAVE, handler);
        };
    }

    onDelete(handler: (event: RepositoryDeletedEvent) => void): () => void {
        this.eventEmitter.on(DELETE, handler);
        return () => {
            return this.eventEmitter.removeListener(DELETE, handler);
        };
    }

    clear() {
        return this.eventEmitter.removeAllListeners();
    }
}
