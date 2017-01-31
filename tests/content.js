
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function injectMe() {

  //inject open pgp here
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('openpgp.js');
  (document.head||document.documentElement).appendChild(s);
  s.onload = function() {
    s.parentNode.removeChild(s);
  };

  var actualCode = '(' + function() {
      // All code is executed in a local scope.
      // For example, the following does NOT overwrite the global `alert` method
      // var alert = null;
      // To overwrite a global variable, prefix `window`:
      // window.bananas = "bananas are so dank";
      console.log("beginning injection");
      var elementData = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.elementData.values(); 
      var elts = []; var done = false; 
      while (!done) {   
        var iter = elementData.next();   
        done = iter.done;   
        elts.push(iter.value); 
      } ;
      var composer = elts.filter(function(elt) {return elt != null && elt.name==="MessengerComposer";})[0];
      var input = elts.filter(function(elt) {return elt != null && elt.name==="MessengerInput";})[0];

      window.bananazAll = elts;
      window.bananaz = composer;
      window.strawberry = input;

      // window.openpgp = require('openpgp.js')

  } + ')();';
  var script = document.createElement('script');
  script.textContent = actualCode;
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);

}

document.onkeydown = function(e) {

  var div1 = document.querySelector("[aria-label='Type a message...']");
  var actualSpan = $(div1).find("div").find("div").find("span").find("span");

  var key = e.which || e.keyCode;
  if (key == 13 && e.preventDefault()) {

    console.log("Enter pressed")

    var message = $(actualSpan).text();
    if (!localStorage["passphrase"]) {
      localStorage["passphrase"] = prompt("set a passphrase");
    }

    var encrypted = sjcl.encrypt(localStorage['passphrase'], message);

    actualSpan.html(encrypted);

  } if (key == 18) {
    console.log("alt pressed")

    var actualCode = '(' + function() {

      //ACTUAL CODE HERE

      console.log("beginning sending");
      var text = document.activeElement.textContent;
      console.log("encrypting text: " + text);
      //encrypt text here

      var pubkey;

      window.openpgp.encryptMessage(pubkey.keys, text).then(function(pgpMessage) {
        // success
        console.log("encryped message: " + pgpMessage);
        window.bananaz.props.onMessageSend(pgpMessage);
        window.strawberry.publicInstance._resetState();

      }).catch(function(error) {
        // failure
        console.log("Failed to encrypt");
      });

    } + ')();';
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);

  };
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.greeting == "decrypt") {
      var encryptedMessages = $("div:contains('{\"iv\":\"')");
      for (var i = 0; i < encryptedMessages.length; i++) {
        var text = $(encryptedMessages[i]).text();
        var html = $(encryptedMessages[i]).html();
        if (text.startsWith("{\"iv") && !html.includes("<div")) {
          try {
            var decrypted = sjcl.decrypt("password", text);
            $(encryptedMessages[i]).text(decrypted);
          } catch (err) {
            //ignore
          }
        }
      }
      var ReqDat = "Completed Decrypting.";       
      sendResponse({farewell: ReqDat});
  } if (request.greeting == "start") {
    //set bananaz to messageComposer

    console.log(request.fbid);

    injectMe();

    //grab facebookID, or save one if doesnt exist
    chrome.storage.local.get('facebookID', function (result) {
        facebookID = result.facebookID;
        console.log("Have a facebookID " + facebookID);
        if (facebookID != null) {
          chrome.storage.local.set({'facebookID': "100000249216086"}, function() {
                // Notify that we saved.
                console.log('FacebookID saved');
              });

                var options = {
                numBits: 2048,
                userId: '100000249216086',
                passphrase: 'super long and hard to guess secret'
          };
        };
    });

    chrome.storage.local.get('publicKey', function (result) {
      // Notify that we saved.
      var publicKey = result.publicKey;
      if (publicKey != null) {
        console.log("Found a public key")
      } else {
        console.log("No public key found, generating a pair")

        window.openpgp.generateKeyPair(options).then(function(keypair) {
          // success
          var privkey = keypair.privateKeyArmored;
          var pubkey = keypair.publicKeyArmored;
          console.log(pubkey)
          // var publicKey = window.openpgp.key.readArmored(key);
          chrome.storage.local.set({'publicKey': pubkey}, function() {
            // Notify that we saved.
            console.log('Public key saved');
          });

          chrome.storage.local.set({'privateKey': privkey}, function() {
            // Notify that we saved.
            console.log('Private key saved');
          });
        }).catch(function(error) {
          // failure
          console.log("Failed to generate keys")
        });
      };
    });
  } else {
      sendResponse({}); // snub them.
    }
});