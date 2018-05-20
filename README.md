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

#### Entity Props

1. Define `XProps` type
    - `XProps` should include `id: Identifier<string|number>` property.
    
```ts
class XIdentifier extends Identifier<string> {}
interface XProps {
    id: XIdentifier; // <= required
}
```    

2. Pass `XProps` to `Entity<XProps>`

```ts
class XEntity extends Entity<XProps> {
    // implement
}
```

You can get the props via `entity.props`.

```ts
const xEntity = new XEntity({
    id: new XIdentifier("x");
});
console.log(xEntity.props.id);
```


**Example:**

```ts
// Entity A
class AIdentifier extends Identifier<string> {}
interface AProps {
    id: AIdentifier;
}
class AEntity extends Entity<AProps> {}
// Entity B
class BIdentifier extends Identifier<string> {}
interface BProps {
    id: BIdentifier;
}
class BEntity extends Entity<BProps> {}
// A is not B
const a = new AEntity({
    id: new AIdentifier("1"))
});
const b = new BEntity({
    id: new BIdentifier("1")
});
assert.ok(!a.equals(b), "A is not B");
```

Props can includes other property.

```ts
/ Entity A
class AIdentifier extends Identifier<string> {}

interface AProps {
    id: AIdentifier;
    a: number;
    b: string;
}

class AEntity extends Entity<AProps> {
    constructor(props: AProps) {
        super(props);
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
import {Identifier, Entity} from "ddd-base";

// X ValueObject
type XProps = { value: number };

class XValue extends ValueObject<XProps> {
    constructor(props: XProps) {
        super(props);
    }
}
// x1's value equal to x2's value
const x1 = new XValue({ value: 42 });
const x2 = new XValue({ value: 42 });
console.log(x1.props.value); // => 42
console.log(x2.props.value); // => 42
console.log(x1.equals(x2));// => true
// x3's value not equal both
const x3 = new XValue({ value: 1 });
console.log(x1.equals(x3));// => false
console.log(x2.equals(x3));// => false
```

:memo: ValueObject's props have not a limitation like Entity.
Because, ValueObject's equability is not identifier.

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

## :memo: Design Note

### Why entity and value object has `props`?

It come from TypeScript limitation.
TypeScript can not define type of class's properties.

```ts
// A limitation of generics interface
type AEntityProps = {
  key: string;
}
class AEntity extends Entity<AEntityProps> {}

const aEntity = new AEntity({
  key: "value"
});
// can not type
aEntity.key; // type is any?
``` 

We can resolve this issue by introducing `props` property.

```ts
// `props` make realize typing
type AEntityProps = {
  key: string;
}
class AEntity extends Entity<AEntityProps> {}

const aEntity = new AEntity({
  key: "value"
});
// can not type
aEntity.props; // props is AEntityProps
``` 

This approach is similar with [React](https://reactjs.org/).

- [Why did React use 'props' as an abbreviation for property/properties? - Quora](https://www.quora.com/Why-did-React-use-props-as-an-abbreviation-for-property-properties)

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
