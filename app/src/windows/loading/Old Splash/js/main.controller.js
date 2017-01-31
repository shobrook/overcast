// GLOBALS

var {ipcRenderer, remote} = require('electron');
var app = remote.require('./app.js');
var axolotl = require('axolotl');
var mongodb = require('mongodb');

var NUM_PREKEYS = 5; 
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/overcast';

// MAIN

onload = function() {
	var webview = document.getElementById("screen"); // Targets the webview container

	// Listens for a successful sign-in attempt
	webview.addEventListener('did-get-redirect-request', function loginHandler(event) {
		if ((event.oldURL == 'https://www.facebook.com/login/password/') && (event.newURL == 'https://www.facebook.com/')) {
			ipcRenderer.send('async', 'User has successfully logged in.');

			// Connect to the database
			MongoClient.connect(url, function(err, db) {
				if (err) {
					ipcRenderer.send('async', 'Unable to connect to the mongoDB server. Error: ' + err);
				} else {
					ipcRenderer.send('async', 'Database connection established to: ' + url);

					// Generate the user's public and private keypair––returns a usable axol instance and underlying store
					function register (callback) {
						var identityKeyPair = null;
						var registrationId = null;
						var signedPreKeyPairs = [];
						var preKeyPairs = [];
						var sessions = {};

						// Implementation of the store interface
						var store = {
							getLocalIdentityKeyPair: function () { console.log('Store.gLIKP'); return identityKeyPair },
							getLocalRegistrationId: function() { console.log('Store.gLRI'); return registrationId },
							getLocalSignedPreKeyPair: function (id) { console.log('Store.gLSPKP ' + id); return signedPreKeyPairs[id] },
							getLocalPreKeyPair: function (id) { console.log('Store.gLPKP ' + id); return preKeyPairs[id] },
						};

						var axol = axolotl(store); // Insantiate an axol instance with underlying store

						// Where the magic happens...
						axol.generateIdentityKeyPair().then(function (result) {
							identityKeyPair = result;
							ipcRenderer.send('async', 'IdentityKeyPair: ' + keyPairToString(result));
							return axol.generateRegistrationId();
						}).then(function (result) {
							registrationId = result;
							ipcRenderer.send('async', 'RegistrationId: ' + result);
							return axol.generatePreKeys(0, NUM_PREKEYS);
						}).then(function (result) {
							preKeyPairs = result;
							ipcRenderer.send('async', 'PreKeys:\n\t' + result.map(function (pair) {
								return 'PreKey #' + pair.id + ': ' + keyPairToString(pair.keyPair);
							}).join('\n\t'));
							return axol.generateLastResortPreKey();
						}).then(function (result) {
							preKeyPairs[result.id] = result;
							ipcRenderer.send('async', 'LastResortPreKey #' + result.id + ': ' + keyPairToString(result.keyPair));
							return axol.generateSignedPreKey(identityKeyPair, 1);
						}).then(function (result) {
							signedPreKeyPairs[result.id] = result;
							ipcRenderer.send('async', 'SignedKeyPair #' + result.id + ': ' + keyPairToString(result.keyPair) + '\n\tsignature: ' 
								+ new Buffer(result.signature).toString('hex'));
							callback(axol, store);
						});
					};

					// Casts a keypair to a string for console logging
					function keyPairToString (keyPair) {
						return ('(public ' + new Buffer(keyPair.public).toString('hex') + ', private ' + new Buffer(keyPair.private).toString('hex') + ')');
					};

					// Register the user and push their data to the server
					register(function (axol, store) {
						ipcRenderer.send('async', 'User has successfully generated prekey bundle.');
						var preKeyBundle = {
							registrationId: store.getLocalRegistrationId(),
							identityKey: new Buffer(store.getLocalIdentityKeyPair().public).toString('hex'),
							preKeyId: 0, // null
							preKey: new Buffer(store.getLocalPreKeyPair(0).keyPair.public).toString('hex'), // null
							signedPreKey: new Buffer(store.getLocalSignedPreKeyPair(1).keyPair.public).toString('hex'),
							signedPreKeySignature: new Buffer(store.getLocalSignedPreKeyPair(1).signature).toString('hex')
						};

						// Push the preKeyBundle 
						var collection = db.collection('keybundles');
						collection.insert(preKeyBundle, function(err, result) {
							if (err) {
								ipcRenderer.send('async', "Unable to push user's keybundle to database. Error: " + err);
							} else {
								ipcRenderer.send('async', 'Initialized the following keybundle: ' + JSON.stringify(result));
							};
							db.close();
						});
					});
				};
			});
		};
	});
};