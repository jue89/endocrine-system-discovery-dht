"use strict";

const DHT = require( 'bittorrent-dht' );
const fp2service = require( './fp2service.js' );

function advertisement() {

	return function( fingerprint, port ) {

		let service = fp2service( fingerprint );

		// TODO: Bootstrap IP?
		let dht = new DHT();

		// Connect to DHT network
		dht.listen( 20000 );

		// Annonce service and port
		dht.announce( service, port );

		// Return the stop method
		return dht.destroy;

	};

}

module.exports = advertisement;
