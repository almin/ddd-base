# ddd-base [![Build Status](https://travis-ci.org/almin/ddd-base.svg?branch=master)](https://travis-ci.org/almin/ddd-base)

**Status**: Experimental

DDD base class library for JavaScript application.

**Notes**:

This library is not depended on [Almin]()https://github.com/almin/almin).
You can use it with other JavaScript framework.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install ddd-base

## Usage

### Entity

Entity's equability is Identifier.

### ValueObject

> Value object is an entity’s state, describing something about the entity or the things it owns.

ValueObject's equability is values.

### Repository

#### NonNullableBaseRepository

#### NullableBaseRepository

### Serializer

> JSON <-> Entity 

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
