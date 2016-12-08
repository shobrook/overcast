var EncryptedLocalStorage = (function(global) {
 'use strict';
  
// Constructor
  var EncryptedLocalStorage = function(secret) {
    if (!secret) {
      throw 'Missing secret!';
    }
    
    this.secret = secret;
  },
  
  // Private methods
  encrypt = function(object, secret) {
    var message = JSON.stringify(object);  
    return CryptoJS.TripleDES.encrypt(message, secret);
  },

  decrypt = function(encrypted, secret) {
    var decrypted = CryptoJS.TripleDES.decrypt(encrypted, secret);  
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };
  
  // Public API
  EncryptedLocalStorage.prototype = {
    
    get: function(key) {
      var encrypted = global.localStorage.getItem(key);      
      return encrypted && decrypt(encrypted, this.secret);
    },
    
    set: function(key, object) {
      if (!object) {
        this.remove(key);
        return;
      }
      
      var encrypted = encrypt(object, this.secret);  
      global.localStorage.setItem(key, encrypted);  
    },
    
    remove: function(key) {
      global.localStorage.removeItem(key);
    }
  };

  return EncryptedLocalStorage;
  
}(window));


// Usage
var els = new EncryptedLocalStorage('secret');
els.set('item', { number: 123 });

console.log('encrypted', window.localStorage.getItem('item'));
console.log('decrypted', els.get('item'));

els.remove('key');
console.log('Removed from localstorage');