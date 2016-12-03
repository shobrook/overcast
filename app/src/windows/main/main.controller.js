// GLOBALS

var {ipcRenderer, remote} = require('electron');
var app = remote.require('./app.js');
var axolotl = require('axolotl');
var mongodb = require('mongodb');

var NUM_PREKEYS = 5; // What should this be?
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/overcast';

// MAIN

onload = function() {
	var webview = document.getElementById("screen"); // Targets the webview container

	// Listens for a successful sign-in attempt
	webview.addEventListener('did-get-redirect-request', function loginHandler(event) {
		if ((event.oldURL == 'https://www.messenger.com/login/password/') && (event.newURL == 'https://www.messenger.com/')) {
			ipcRenderer.send('async', 'User has successfully logged in.');

			// Connect to the database
			MongoClient.connect(url, function(err, db) {
				if (err) {
					ipcRenderer.send('async', 'Unable to connect to the mongoDB server. Error: ' + err);
				} else {
					ipcRenderer.send('async', 'Database connection established to: ' + url);

					var collection = db.collection('registers'); // Assign a path for the collection
					var record = {"id":0} // Initialized an empty user document

					// TO-DO: Scrape the user's static thread ID and modify the document above

					// Inserts the user registration document (with only the thread ID inside)
					collection.insert(record, function(err, result) {
						if (err) {
							ipcRenderer.send('async', 'Unable to insert user record. Error: ' + err);
						} else {
							ipcRenderer.send('async', 'Initialized the following user record: ' + JSON.stringify(result)); 
						}
						db.close();
					});

					// Generate the user's keypair and pushes to local dirs + server
					function register (callback) {
						var identityKeyPair = null
						var registrationId = null
						var signedPreKeyPairs = []
						var preKeyPairs = []
						var sessions = {}

						// Implementation of the store interface
						var store = {
							getLocalIdentityKeyPair: function () { console.log('Store.gLIKP'); return identityKeyPair },
							getLocalRegistrationId: function() { console.log('Store.gLRI'); return registrationId },
							getLocalSignedPreKeyPair: function (id) { console.log('Store.gLSPKP ' + id); return signedPreKeyPairs[id] },
							getLocalPreKeyPair: function (id) { console.log('Store.gLPKP ' + id); return preKeyPairs[id] },
						}

						var axol = axolotl(store); // Insantiate an axol instance with underlying store

						// Where the magic happens...
						axol.generateIdentityKeyPair().then(function (result) {
							identityKeyPair = result;
							ipcRenderer.send('async', 'IdentityKeyPair: ' + keyPairToString(result));
							return axol.generateRegistrationId();
							// TO-DO: Hash private keypair and store in local directory
						}).then(function (result) {
							registrationId = result;
							ipcRenderer.send('async', 'RegistrationId: ' + result);
							return axol.generatePreKeys(0, NUM_PREKEYS);
							// TO-DO: Hash registration ID and store in local directory
						}).then(function (result) {
							preKeyPairs = result;
							ipcRenderer.send('async', 'PreKeys:\n\t' + result.map(function (pair) {
								return 'PreKey #' + pair.id + ': ' + keyPairToString(pair.keyPair);
							}).join('\n\t'));
							return axol.generateLastResortPreKey();
							// TO-DO: Cast prekeys to an object with 'id: prekey' pairs, concatenate to existing user record
								// console.log() > PreKeys: PreKey #0: (pub XYZ, priv XYZ), PreKey #1: (public XYZ, priv XYZ), ...
						}).then(function (result) {
							preKeyPairs[result.id] = result;
							ipcRenderer.send('async', 'LastResortPreKey #' + result.id + ': ' + keyPairToString(result.keyPair));
							return axol.generateSignedPreKey(identityKeyPair, 1);
							// TO-DO: Concatenate last resort prekey to existing user record
								// console.log() > LastResortPreKey #167777215: (pub XYZ, priv XYZ)
						}).then(function (result) {
							signedPreKeyPairs[result.id] = result;
							ipcRenderer.send('async', 'SignedKeyPair #' + result.id + ': ' + keyPairToString(result.keyPair) + '\n\tsignature: ' + new Buffer(result.signature).toString('hex'));
							callback(axol, store);
							// TO-DO: Concatenate first signed prekey to existing user record
								// console.log() > SignedKeyPair #1: (pub XYZ, priv XYZ) signature: XYZ
						});
					}

					// Casts a keypair to a string for console logging
					function keyPairToString (keyPair) {
						return ('(public ' + new Buffer(keyPair.public).toString('hex') + ', private ' + new Buffer(keyPair.private).toString('hex') + ')');
					}

					// Call and verify
					register(function (result) {
						ipcRenderer.send('async', 'User has successfully been registered.');
					});
				}
			});
		}
	});
}

/* PSEUDOCODE
 
 * 'did-get-redirect-request' DOM event listener for a successful sign-in
 * Sign-in event handler needs to do the following:
     * Scrape the user's unique thread ID from facebook
     * Generate the user's identity keypair
         * Hash and save this data in a local directory
     * Generate the user's first set of prekeys, last resort prekey, and first signed prekey
         * Push this data and the user ID to the server
 * Onload runs only when overcast IDs don't match

*/