var axolotl = require('axolotl');
var NUM_PREKEYS = 5; // What should this be?

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
    console.log('IdentityKeyPair: ' + keyPairToString(result));
    return axol.generateRegistrationId();
    // TO-DO: Hash private keypair and store in local directory
  }).then(function (result) {
    registrationId = result;
    console.log('RegistrationId: ' + result);
    return axol.generatePreKeys(0, NUM_PREKEYS);
    // TO-DO: Hash registration ID and store in local directory
  }).then(function (result) {
    preKeyPairs = result;
    console.log('PreKeys:\n\t' + result.map(function (pair) {
      return 'PreKey #' + pair.id + ': ' + keyPairToString(pair.keyPair);
    }).join('\n\t'));
    return axol.generateLastResortPreKey();
    // TO-DO: Cast prekeys to an object with 'id: prekey' pairs, concatenate to existing user record
      // console.log() > PreKeys: PreKey #0: (pub XYZ, priv XYZ), PreKey #1: (public XYZ, priv XYZ), ...
  }).then(function (result) {
    preKeyPairs[result.id] = result;
    console.log('LastResortPreKey #' + result.id + ': ' + keyPairToString(result.keyPair));
    return axol.generateSignedPreKey(identityKeyPair, 1);
    // TO-DO: Concatenate last resort prekey to existing user record
      // console.log() > LastResortPreKey #167777215: (pub XYZ, priv XYZ)
  }).then(function (result) {
    signedPreKeyPairs[result.id] = result;
    console.log('SignedKeyPair #' + result.id + ': ' + keyPairToString(result.keyPair) + '\n\tsignature: ' 
      + new Buffer(result.signature).toString('hex'));
    // TO-DO: Concatenate first signed prekey to existing user record
      // console.log() > SignedKeyPair #1: (pub XYZ, priv XYZ) signature: XYZ
    callback(axol, store);
  });
};

// Casts a keypair to a string for console logging
function keyPairToString (keyPair) {
  return ('(public ' + new Buffer(keyPair.public).toString('hex') + ', private ' + new Buffer(keyPair.private).toString('hex') + ')');
};


register(function (axolA, storeA) {
  console.log('Generated registration info A')
  register(function (axolB, storeB) {
    console.log('Generated registration info B')

    var preKeyBundleForB = {
      registrationId: storeB.getLocalRegistrationId(),
      identityKey: storeB.getLocalIdentityKeyPair().public,
      preKeyId: 0,
      preKey: storeB.getLocalPreKeyPair(0).keyPair.public,
      signedPreKeyId: 1,
      signedPreKey: storeB.getLocalSignedPreKeyPair(1).keyPair.public,
      signedPreKeySignature: storeB.getLocalSignedPreKeyPair(1).signature
    }

    console.log('Creating sessAtoB')
    var sessAtoB = null
    axolA.createSessionFromPreKeyBundle(preKeyBundleForB).then(function (result) {
      console.log('Encrypting message from A to B')
      sessAtoB = result
      return axolA.encryptMessage(sessAtoB, new Buffer('magic letters'))
    }, function (err) {
      console.log('failed to create session')
    }).then(function (msg) {
      console.log('Encrypted! message:' + new Buffer(msg.body).toString('hex'))
      return axolB.decryptPreKeyWhisperMessage(undefined, msg.body)
    }, function (err) {
      console.log('failed to encrypt')
    }).then(function (msg) {
      console.log('Decrypted! message:' + new Buffer(msg.body).toString('hex'))
    }, function (err) {
      console.log('failed to decrypt: ' + err)
    })
  })
})