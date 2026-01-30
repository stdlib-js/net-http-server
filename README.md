<!--

@license Apache-2.0

Copyright (c) 2018 The Stdlib Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->


<details>
  <summary>
    About stdlib...
  </summary>
  <p>We believe in a future in which the web is a preferred environment for numerical computation. To help realize this future, we've built stdlib. stdlib is a standard library, with an emphasis on numerical and scientific computation, written in JavaScript (and C) for execution in browsers and in Node.js.</p>
  <p>The library is fully decomposable, being architected in such a way that you can swap out and mix and match APIs and functionality to cater to your exact preferences and use cases.</p>
  <p>When you use stdlib, you can be absolutely certain that you are using the most thorough, rigorous, well-written, studied, documented, tested, measured, and high-quality code out there.</p>
  <p>To join us in bringing numerical computing to the web, get started by checking us out on <a href="https://github.com/stdlib-js/stdlib">GitHub</a>, and please consider <a href="https://opencollective.com/stdlib">financially supporting stdlib</a>. We greatly appreciate your continued support!</p>
</details>

# HTTP Server

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> [HTTP][nodejs-http] server.



<section class="usage">

## Usage

```javascript
import httpServerFactory from 'https://cdn.jsdelivr.net/gh/stdlib-js/net-http-server@v0.2.3-deno/mod.js';
```

#### httpServerFactory( \[options,] \[requestListener] )

Returns a function to create an [HTTP][nodejs-http] server.

```javascript
var httpServer = httpServerFactory();
```

The function supports the following parameters:

-   **options**: options (_optional_).
-   **requestListener**: callback to invoke upon receiving an HTTP request (_optional_).

To bind a request callback to a server, provide a `requestListener`.

```javascript
function requestListener( request, response ) {
    console.log( request.url );
    response.end( 'OK' );
}

var httpServer = httpServerFactory( requestListener );
```

In addition to the options supported by [`http.createServer`][nodejs-http-create-server], the function accepts the following options:

-   **port**: server port. Default: `0` (i.e., randomly assigned).
-   **maxport**: max server port when port hunting. Default: `maxport=port`.
-   **hostname**: server hostname.
-   **address**: server address. Default: `127.0.0.1`.

To specify server options, provide an options object.

```javascript
var opts = {
    'port': 7331,
    'address': '0.0.0.0'
};

var httpServer = httpServerFactory( opts );
```

To specify a range of permissible ports, set the `maxport` option.

```javascript
var opts = {
    'maxport': 9999
};

var httpServer = httpServerFactory( opts );
```

When provided a `maxport` option, a created server will search for the first available `port` on which to listen, starting from `port`.

#### httpServer( done )

Creates an [HTTP][nodejs-http] server.

```javascript
function done( error, server ) {
    if ( error ) {
        throw error;
    }
    console.log( 'Success!' );
    server.close();
}

var httpServer = httpServerFactory();

httpServer( done );
```

The function supports the following parameters:

-   **done**: callback to invoke once a server is listening and ready to handle requests.

</section>

<!-- /.usage -->

<section class="notes">

## Notes

-   Which server options are supported depends on the Node.js version. Older Node.js versions (e.g., &lt;= v8.12.0) do not support an options object when calling [`http.createServer`][nodejs-http-create-server], and, for those versions, any options supported by [`http.createServer`][nodejs-http-create-server] in later Node.js versions are ignored.
-   Port hunting can be useful in a microservice deployment. When a `port` is randomly assigned (`options.port=0`), if a server fails and is restarted, the server is unlikely to bind to its previous `port`. By allowing a constrained search, assuming no lower `ports` within a specified range have freed up in the meantime, the likelihood of listening on the same `port` is increased. A server can typically restart and bind to the same `port` faster than binding to a new `port` and re-registering with a microservice registry, thus minimizing possible service interruption and downtime.

</section>

<!-- /.notes -->

<section class="examples">

## Examples

<!-- eslint-disable node/no-process-exit -->

<!-- eslint no-undef: "error" -->

```javascript
var proc = require( 'process' );
var http = require( 'http' );
import httpServerFactory from 'https://cdn.jsdelivr.net/gh/stdlib-js/net-http-server@v0.2.3-deno/mod.js';

function done( error, server ) {
    if ( error ) {
        throw error;
    }
    http.get( 'http://127.0.0.1:7331/beep/boop', onResponse );
}

function onResponse() {
    console.log( 'Success!' );
    proc.exit( 0 );
}

function onRequest( request, response ) {
    console.log( request.url );
    response.end( 'OK' );
}

// Specify server options...
var opts = {
    'port': 7331,
    'maxport': 9999,
    'hostname': 'localhost'
};

// Create a function for creating an HTTP server...
var httpServer = httpServerFactory( opts, onRequest );

// Create a server:
httpServer( done );
```

</section>

<!-- /.examples -->

<!-- Section for related `stdlib` packages. Do not manually edit this section, as it is automatically populated. -->

<section class="related">

</section>

<!-- /.related -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->


<section class="main-repo" >

* * *

## Notice

This package is part of [stdlib][stdlib], a standard library with an emphasis on numerical and scientific computing. The library provides a collection of robust, high performance libraries for mathematics, statistics, streams, utilities, and more.

For more information on the project, filing bug reports and feature requests, and guidance on how to develop [stdlib][stdlib], see the main project [repository][stdlib].

#### Community

[![Chat][chat-image]][chat-url]

---

## License

See [LICENSE][stdlib-license].


## Copyright

Copyright &copy; 2016-2026. The Stdlib [Authors][stdlib-authors].

</section>

<!-- /.stdlib -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="links">

[npm-image]: http://img.shields.io/npm/v/@stdlib/net-http-server.svg
[npm-url]: https://npmjs.org/package/@stdlib/net-http-server

[test-image]: https://github.com/stdlib-js/net-http-server/actions/workflows/test.yml/badge.svg?branch=v0.2.3
[test-url]: https://github.com/stdlib-js/net-http-server/actions/workflows/test.yml?query=branch:v0.2.3

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/net-http-server/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/net-http-server?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/net-http-server.svg
[dependencies-url]: https://david-dm.org/stdlib-js/net-http-server/main

-->

[chat-image]: https://img.shields.io/badge/zulip-join_chat-brightgreen.svg
[chat-url]: https://stdlib.zulipchat.com

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/net-http-server/tree/deno
[deno-readme]: https://github.com/stdlib-js/net-http-server/blob/deno/README.md
[umd-url]: https://github.com/stdlib-js/net-http-server/tree/umd
[umd-readme]: https://github.com/stdlib-js/net-http-server/blob/umd/README.md
[esm-url]: https://github.com/stdlib-js/net-http-server/tree/esm
[esm-readme]: https://github.com/stdlib-js/net-http-server/blob/esm/README.md
[branches-url]: https://github.com/stdlib-js/net-http-server/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/net-http-server/main/LICENSE

[nodejs-http]: https://nodejs.org/api/http.html

[nodejs-http-create-server]: https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener

</section>

<!-- /.links -->
