import { Entity, Identifier, ValueObject } from "../src";
import * as assert from "assert";

class ShoppingCartItemIdentifier extends Identifier<string> {}

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
        super(props);
        this.id = props.id;
        this.name = props.name;
        this.price = props.price;
    }
}

interface ShoppingCartItemCollectionProps {
    items: ShoppingCartItem[];
}

class ShoppingCartItemCollection extends ValueObject<ShoppingCartItemCollectionProps>
    implements ShoppingCartItemCollectionProps {
    items: ShoppingCartItem[];

    constructor(props: ShoppingCartItemCollectionProps) {
        super(props);
        this.items = props.items;
    }
}

class ShoppingIdentifier extends Identifier<string> {}

interface ShoppingCartProps {
    id: ShoppingIdentifier;
    itemsCollection: ShoppingCartItemCollection;
}

class ShoppingCart extends Entity<ShoppingCartProps> implements ShoppingCartProps {
    id: ShoppingIdentifier;
    itemsCollection: ShoppingCartItemCollection;

    constructor(props: ShoppingCartProps) {
        super(props);
        this.id = props.id;
        this.itemsCollection = props.itemsCollection;
    }
}

describe("Domain-scenario", () => {
    it("should have own property and props", () => {
        const shoppingCart = new ShoppingCart({
            id: new ShoppingCartItemIdentifier("shopping-cart"),
            itemsCollection: new ShoppingCartItemCollection({
                items: []
            })
        });
        assert.ok(Array.isArray(shoppingCart.itemsCollection.items));
        assert.strictEqual(shoppingCart.itemsCollection.items, shoppingCart.props.itemsCollection.props.items);
    });
});
