# ddd-base [![Build Status](https://travis-ci.org/almin/ddd-base.svg?branch=master)](https://travis-ci.org/almin/ddd-base)

**Status**: Experimental

DDD base class library for JavaScript client-side application.

**Notes**:

This library is not depended on [Almin](https://github.com/almin/almin).
You can use it with other JavaScript framework.

## Features

This library provide basic DDD base classes.

- `Entity`: Entity is domain concept that have a unique identity
- `Identifier`: Identifier is unique identifier for an Entity
- `ValueObject`: Value Object is an entity’s state, describing something about the entity
- `Repository`: Repository is used to manage aggregate persistence
- `Serializer`: Serializer is convert between Entity <-> JSON(Data object)

## Install

Install with [npm](https://www.npmjs.com/):

    npm install ddd-base

## Usage

### Entity

> Entities are domain concepts that have a unique identity in the problem domain.

Entity's equability is Identifier.

```ts
import {Identifier,Entity} from "ddd-base";
// Entity A
class AIdentifier extends Identifier<string> {}
class AEntity extends Entity<AIdentifier> {}
// Entity B
class BIdentifier extends Identifier<string> {}
class BEntity extends Entity<BIdentifier> {}
// A is not B
const a = new AEntity(new AIdentifier("1"));
const b = new BEntity(new BIdentifier("1"));
assert.ok(!a.equals(b), "A is not B");
```

More complex Entity example.

```ts
/ Entity A
class AIdentifier extends Identifier<string> {}

interface AEntityArgs {
    id: AIdentifier;
    a: number;
    b: string;
}

class AEntity extends Entity<AIdentifier> {
    private a: number;
    private b: string;

    constructor(args: AEntityArgs) {
        super(args.id);
        this.a = args.a;
        this.b = args.b;
    }

    toJSON(): AEntityJSON {
        return {
            id: this.id.toValue(),
            a: this.a,
            b: this.b
        };
    }
}

const entity = new AEntity({
    id: new AIdentifier("a"),
    a: 42,
    b: "string"
});
```

### ValueObject

> Value object is an entity’s state, describing something about the entity or the things it owns.

ValueObject's equability is values.

```ts
import {Identifier,Entity} from "ddd-base";
// X ValueObject
class XValue extends ValueObject {
    constructor(public x: number) {
        super();
    }
}
// x1's value equal to x2's value
const x1 = new XValue(42);
const x2 = new XValue(42);
console.log(x1.equals(x2));// => true
// x3's value not equal both
const x3 = new XValue(1);
console.log(x1.equals(x3));// => false
console.log(x2.equals(x3));// => false
```

### Repository

> A repository is used to manage aggregate persistence and retrieval while ensuring that there is a separation between the domain model and the data model. 

`Repository` collect entity.

Currently, `Repository` implementation is in-memory database like Map.
This library provide following types of repository.

- `NonNullableBaseRepository`
- `NullableBaseRepository`

#### NonNullableBaseRepository

`NonNullableRepository` has initial value.
In other words, NonNullableRepository#get always return a value.

```ts
export declare class NonNullableRepository<T extends Entity<any>> {
    protected initialEntity: T;
    private core;
    constructor(initialEntity: T);
    readonly map: MapLike<string, T>;
    readonly events: RepositoryEventEmitter;
    get(): T;
    getAll(): T[];
    findById(entityId?: T["id"]): T | undefined;
    save(entity: T): void;
    delete(entity: T): void;
    clear(): void;
}
```

#### NullableBaseRepository

`NullableRepository` has not initial value.
In other word, NullableRepository#get may return undefined.

```ts
export declare class NullableRepository<T extends Entity<any>> {
    private core;
    constructor();
    readonly map: MapLike<string, T>;
    readonly events: RepositoryEventEmitter;
    get(): T | undefined;
    getAll(): T[];
    findById(entityId?: T["id"]): T | undefined;
    save(entity: T): void;
    delete(entity: T): void;
    clear(): void;
}
```

### Serializer

> JSON <-> Entity 

DDD-base just define the interface of `Serializer` that does following converting.

- Convert from JSON to Entity
- Convert from Entity to JSON

You can implement `Serializer` interface and use it.

```ts
export interface Serializer<Entity, JSON> {
    /**
     * Convert Entity to JSON format
     */
    toJSON(entity: Entity): JSON;

    /**
     * Convert JSON to Entity
     */
    fromJSON(json: JSON): Entity;
}
```


Implementation:

```ts
// Entity A
class AIdentifier extends Identifier<string> {}

interface AEntityArgs {
    id: AIdentifier;
    a: number;
    b: string;
}

class AEntity extends Entity<AIdentifier> {
    private a: number;
    private b: string;

    constructor(args: AEntityArgs) {
        super(args.id);
        this.a = args.a;
        this.b = args.b;
    }

    toJSON(): AEntityJSON {
        return {
            id: this.id.toValue(),
            a: this.a,
            b: this.b
        };
    }
}
// JSON
interface AEntityJSON {
    id: string;
    a: number;
    b: string;
}

// Serializer
const ASerializer: Serializer<AEntity, AEntityJSON> = {
    fromJSON(json) {
        return new AEntity({
            id: new AIdentifier(json.id),
            a: json.a,
            b: json.b
        });
    },
    toJSON(entity) {
        return entity.toJSON();
    }
};

it("toJSON: Entity -> JSON", () => {
    const entity = new AEntity({
        id: new AIdentifier("a"),
        a: 42,
        b: "b prop"
    });
    const json = ASerializer.toJSON(entity);
    assert.deepStrictEqual(json, {
        id: "a",
        a: 42,
        b: "b prop"
    });
});

it("fromJSON: JSON -> Entity", () => {
    const entity = ASerializer.fromJSON({
        id: "a",
        a: 42,
        b: "b prop"
    });
    assert.ok(entity instanceof AEntity, "entity should be instanceof AEntity");
    assert.deepStrictEqual(
        ASerializer.toJSON(entity),
        {
            id: "a",
            a: 42,
            b: "b prop"
        },
        "JSON <-> Entity"
    );
});
```

## Real UseCase

- [azu/irodr: RSS reader client like LDR for Inoreader.](https://github.com/azu/irodr "azu/irodr: RSS reader client like LDR for Inoreader.")
- [azu/searchive: Search All My Documents{PDF}.](https://github.com/azu/searchive "azu/searchive: Search All My Documents{PDF}.")
- [proofdict/editor: Proofdict editor.](https://github.com/proofdict/editor "proofdict/editor: Proofdict editor.")

## Changelog

See [Releases page](https://github.com/almin/ddd-base/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/almin/ddd-base/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
