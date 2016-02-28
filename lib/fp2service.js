"use strict";

function fp2service( fingerprint ) {
	// First 40 charactars of the hash are used for DHT discovery
	return fingerprint.replace( /\:/g, '' ).substr( 0, 40 );
}

module.exports = fp2service;
