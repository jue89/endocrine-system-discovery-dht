"use strict";

const DHT = require( 'bittorrent-dht' );
const fp2service = require( './fp2service.js' );

function discovery( timeout ) {

	// Make sure timeout is a number
	if( typeof timeout != 'number' ) timeout = null;

	// Factory for the mDNS discovery method
	return function( fingerprint ) {

		// The first 7 chars are enough to find our broker
		let service = fp2service( fingerprint );

		let dht = new DHT();

		// Connect to DHT network
		dht.listen( 20001 );

		return new Promise( ( resolve, reject ) => {

			// Set a timeout for discovery if user specified one
			let timeoutHandle = null;
			if( timeout ) timeoutHandle = setTimeout( () => {

				// Stop browser
				dht.removeAllListeners();
				dht.destroy();

				// Reject since we haven't obtained an anwser within specified time
				reject();

			}, timeout * 1000 );

			// Setup event listener
			dht.on( 'peer', ( peer, hash ) => {

				// Make sure the hash ist matchting. If not -> skip
				if( hash.toString( 'hex' ) === service ) return;

				// We found a broker! Stop searching, timeout and resovle
				dht.destroy();

				if( timeoutHandle ) clearTimeout( timeoutHandle );

				// Create mqtts URL
				resolve( 'mqtts://' + peer.host + ':' + peer.port.toString() );

			} );

			// Look for broker
			dht.lookup( service );

		} );

	}

}

module.exports = discovery;
