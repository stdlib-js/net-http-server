/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var http = require( 'http' );
var logger = require( 'debug' );
var isFunction = require( '@stdlib/assert-is-function' );
var format = require( '@stdlib/string-format' );
var validate = require( './validate.js' );
var DEFAULTS = require( './defaults.json' );


// VARIABLES //

var debug = logger( '@stdlib/net-http-server' );


// MAIN //

/**
* Returns a function which creates an HTTP server.
*
* @param {Options} [options] - server options
* @param {NonNegativeInteger} [options.port=0] - server port
* @param {NonNegativeInteger} [options.maxport] - max server port
* @param {string} [options.hostname] - server hostname
* @param {string} [options.address="127.0.0.1"] - server address
* @param {Callback} [requestListener] - callback invoked upon receiving an HTTP request
* @throws {TypeError} `requestListener` must be a function
* @throws {TypeError} must provide valid options
* @returns {Function} function which creates an HTTP server
*
* @example
* var createServer = httpServer();
*
* @example
* var opts = {
*     'port': 7331,
*     'address': '0.0.0.0'
* };
* var createServer = httpServer( opts );
*
* @example
* var opts = {
*     'port': 7331,
*     'address': '0.0.0.0'
* };
* function onRequest( request, response ) {
*     console.log( request.url );
*     response.end( 'OK' );
* }
* var createServer = httpServer( opts, onRequest );
*/
function httpServer() {
	var requestListener;
	var hostname;
	var options;
	var nargs;
	var opts;
	var port;
	var max;
	var err;

	nargs = arguments.length;
	opts = {};
	if ( nargs === 1 ) {
		if ( isFunction( arguments[0] ) ) {
			requestListener = arguments[ 0 ];
		} else {
			options = arguments[ 0 ];
			err = validate( opts, options );
		}
	}
	else if ( nargs > 1 ) {
		options = arguments[ 0 ];
		requestListener = arguments[ 1 ];
		if ( !isFunction( requestListener ) ) {
			throw new TypeError( format( 'invalid argument. Request listener must be a function. Value: `%s`.', requestListener ) );
		}
		err = validate( opts, options );
	}
	if ( err ) {
		throw err;
	}
	if ( opts.port === void 0 ) {
		port = DEFAULTS.port;
	} else {
		port = opts.port;
	}
	debug( 'Server port: %d', port );

	if ( opts.maxport === void 0 ) {
		max = port;
	} else {
		max = opts.maxport;
	}
	debug( 'Max server port: %d', max );

	if ( opts.hostname ) {
		hostname = opts.hostname;
	}
	else if ( opts.address ) {
		hostname = opts.address;
	}
	else {
		hostname = DEFAULTS.address;
	}
	debug( 'Server hostname: %s', hostname );

	return createServer;

	/**
	* Creates an HTTP server.
	*
	* @private
	* @param {Callback} done - function to invoke after creating a server
	* @throws {TypeError} must provide a function
	*
	* @example
	* function done( error, server ) {
	*     if ( error ) {
	*         throw error;
	*     }
	*     console.log( 'Success!' );
	*     server.close();
	* }
	* createServer( done );
	*/
	function createServer( done ) {
		var server;
		if ( !isFunction( done ) ) {
			throw new TypeError( format( 'invalid argument. Callback argument must be a function. Value: `%s`.', done ) );
		}
		if ( requestListener ) {
			server = http.createServer( requestListener );
		} else {
			server = http.createServer();
		}
		server.on( 'error', errorListener );
		server.once( 'listening', onListen );

		debug( 'Attempting to listen on %s:%d.', hostname, port );
		server.listen( port, hostname );

		/**
		* Server error event handler.
		*
		* @private
		* @param {Error} error - server error
		* @throws {Error} server error
		*/
		function errorListener( error ) {
			if ( error.code === 'EADDRINUSE' ) {
				debug( 'Server address already in use: %s:%d.', hostname, port );
				port += 1;
				if ( port <= max ) {
					debug( 'Attempting to listen on %s:%d.', hostname, port );
					server.listen( port, hostname );
					return;
				}
			}
			throw error;
		}

		/**
		* Callback invoked once a server is listening and ready to handle requests.
		*
		* @private
		*/
		function onListen() {
			var addr = server.address();
			debug( 'HTTP server initialized. Server is listening for requests on %s:%d.', addr.address, addr.port );
			done( null, server );
		}
	}
}


// EXPORTS //

module.exports = httpServer;
