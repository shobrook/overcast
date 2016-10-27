var crypto = require("axolotl-crypto");
var axolotl = require("axolotl");

var store = {
	identityKeyPair: {
		public: new ArrayBuffer(),
		private: new ArrayBuffer(),
	},
	registrationId: 0,
	getLocalIdentityKeyPair: function() {
		return identityKeyPair;
	},
	getLocalRegistrationId: function() {
		return this.registrationId;
	},
	getLocalSignedPreKeyPair: function(signedPreKeyId) {
		return identityKeyPair;
	},
	getLocalPreKeyPair: function(preKeyId) {
		return identityKeyPair;
	},
}

var axol = axolotl(store);	

axol.generateIdentityKeyPair().then(function(KeyPair) { // Generate our identity key
	console.log(KeyPair);
	// Push KeyPair to local storage module
});
axol.generateRegistrationId().then(function(RegistrationId) { // Generate our registration id
	console.log(RegistrationId);
	// Push RegistrationId to local storage module
});
axol.generatePreKeys(0, 100).then(function(preKeyId) { // Generate the first set of our pre-keys to send to the server
	console.log(preKeyId);
	// Push preKeyId to server
}); 
axol.generateLastResortPreKey().then(function(preKeyId) { // Generate our last restore pre-key to send to the server
	console.log(preKeyId);
	// Push preKeyId to server
});
axol.generateSignedPreKey(identityKeyPair, 1).then(function(preKeyId) { // Generate our first signed pre-key to send to the server
	console.log(preKeyId);
	// Push preKeyId to server
});