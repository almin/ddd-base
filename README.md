# ddd-base [![Build Status](https://travis-ci.org/almin/ddd-base.svg?branch=master)](https://travis-ci.org/almin/ddd-base)

**Status**: Experimental

DDD base class library for JavaScript client-side application.

**Notes**:

This library does not depend on [Almin](https://github.com/almin/almin).
You can use it with other JavaScript framework.

## Features

This library provide basic DDD base classes.

- [`Entity`](#entity): Entity is domain concept that have a unique identity
- [`Identifier`](#identifier): Identifier is unique identifier for an Entity
- [`ValueObject`](#valueobject): Value Object is an entity’s state, describing something about the entity
- [`Repository`](#repository): Repository is used to manage aggregate persistence
- [`Converter`](#converter): Converter convert between Entity <-> Props(Entity's props) <-> JSON(Serialized data object)

## Install

Install with [npm](https://www.npmjs.com/):

    npm install ddd-base

## Usage

### Entity

> Entities are domain concepts that have a unique identity in the problem domain.

Entity's equability is Identifier.

### Identifier

Identifier is a unique object for each entity.

`Entity#equals` check that the Entity's identifier is equaled to other entity's identifier.

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
import {ValueObject} from "ddd-base";

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
/**
 * NonNullableRepository has initial value.
 * In other words, NonNullableRepository#get always return a value.
 */
export declare class NonNullableRepository<Entity extends EntityLike<any>, Props extends Entity["props"], Id extends Props["id"]> {
    protected initialEntity: Entity;
    private core;
    constructor(initialEntity: Entity);
    readonly map: MapLike<string, Entity>;
    readonly events: RepositoryEventEmitter<Entity>;
    get(): Entity;
    getAll(): Entity[];
    findById(entityId?: Id): Entity | undefined;
    save(entity: Entity): void;
    delete(entity: Entity): void;
    clear(): void;
}

```

#### NullableBaseRepository

`NullableRepository` has not initial value.
In other word, NullableRepository#get may return undefined.

```ts
/**
 * NullableRepository has not initial value.
 * In other word, NullableRepository#get may return undefined.
 */
export declare class NullableRepository<Entity extends EntityLike<any>, Props extends Entity["props"], Id extends Props["id"]> {
    private core;
    constructor();
    readonly map: MapLike<string, Entity>;
    readonly events: RepositoryEventEmitter<Entity>;
    get(): Entity | undefined;
    getAll(): Entity[];
    findById(entityId?: Id): Entity | undefined;
    save(entity: Entity): void;
    delete(entity: Entity): void;
    clear(): void;
}
```

### Converter

> JSON <-> Props <-> Entity

Converter is that convert JSON <-> Props <-> Entity.

`createConverter` create interconversion function from `Props` and `JSON` types and mapping definition.

```ts
// Pass Props type and JSON types as generics
// 1st argument is that a Constructor of entity that is required for creating entity from JSON
// 2nd argument is that a mapping object
// mapping object has tuple array for each property.
// tuple is [Props to JSON, JSON to Props]  
createConverter<PropsType, JSONType>(EntityConstructor, mappingObject)
```

mapping object has has tuple array for each property.

```ts
const converter = createConverter<EntityProps, EntityJSON>(Entity, {
    id: [propsToJSON function, jsonToProps function],
    // [(prop value) => json value, (json value) => prop value]
});
```

Example of `createConveter`.

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
// Create converter
// Tuple has two convert function that Props -> JSON and JSON -> Props
const converter = createConverter<AProps, AEntityJSON>(AEntity, {
    // conveter definition for each property.
    id: [prop => prop.toValue(), json => new AIdentifier(json)],
    a: [prop => prop, json => json],
    b: [prop => prop, json => json]
});
const entity = new AEntity({
    id: new AIdentifier("a"),
    a: 42,
    b: "b prop"
});
// Entity to JSON
const json = converter.entityToJSON(entity);
assert.deepStrictEqual(json, {
    id: "a",
    a: 42,
    b: "b prop"
});
// JSON to Entity
const entity_conveterted = converter.jsonToEntity(json);
assert.deepStrictEqual(entity, entity_conveterted);
// JSON to Props
const props = converter.jsonToProps(json);
assert.deepStrictEqual(props, entity.props);
```

:memo: Limitation: 

Convert can be possible one for one converting.

```
// Can not do convert following pattern
// JSON -> Entity
// a -> b, c properties
```

### [Deprecated] Serializer

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

### Nesting props is ugly

If you want to access nested propery via `props`, you have written `a.props.b.props.c`.
It is ugly syntax.

Instead of this, you can assign `props` values to entity's properties directly.

```ts
class ShoppingCartItemIdentifier extends Identifier<string> {
}

interface ShoppingCartItemProps {
    id: ShoppingCartItemIdentifier;
    name: string;
    price: number;
}

class ShoppingCartItem extends Entity<ShoppingCartItemProps> implements ShoppingCartItemProps {
    id: ShoppingCartItemIdentifier;
    name: string;
    price: number;

    constructor(props: ShoppingCartItemProps) {
        // pass to props
        super(props);
        // assign own property
        this.id = props.id;
        this.name = props.name;
        this.price = props.price;
    }
}

const item = new ShoppingCartItem({
    id: new ShoppingCartItemIdentifier("item 1");
    name: "bag";
    price: 1000
});

console.log(item.props.price === item.price); // => true
```

### `props` is readonly by default

> This is related with "Nesting props is ugly"

`props` is `readonly` and `Object.freeze(props)` by default.

**props**:

It is clear that `props` are a Entity's **configureation**.
They are **received** from above and immutable as far as the Entity receiving them is concerned.

**state**:

ddd-base does not define `state` type.
But, `state` is own properties of Entity.
It is mutable value and it can be modified by default.

For example, `this.id`, `this.name`, and `this.price` are state of `ShoppingCartItem`.
You can mofify this state.

```ts
class ShoppingCartItemIdentifier extends Identifier<string> {
}

interface ShoppingCartItemProps {
    id: ShoppingCartItemIdentifier;
    name: string;
    price: number;
}

class ShoppingCartItem extends Entity<ShoppingCartItemProps> implements ShoppingCartItemProps {
    id: ShoppingCartItemIdentifier;
    name: string;
    price: number;

    constructor(props: ShoppingCartItemProps) {
        // pass to props
        super(props);
        // assign own property
        this.id = props.id;
        this.name = props.name;
        this.price = props.price;
    }
}
```

### Changing _props_ and _state_

|                                           | *props* | *state* |
| ----------------------------------------- | ------- | ------- |
| Can get initial value from parent Entity? | Yes     | Yes     |
| Can be changed by parent Entity?          | Yes     | No      |
| Can set default values inside Entity?     | Yes     | Yes     |
| Can change inside Entity?                 | No      | Yes     |
| Can set initial value for child Entity?   | Yes     | Yes     |



Related concept:

- [react-guide/props-vs-state.md at master · uberVU/react-guide](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
- [Thinking in React - React](https://reactjs.org/docs/thinking-in-react.html)

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
