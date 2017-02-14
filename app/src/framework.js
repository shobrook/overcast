// GLOBALS

var {ipcRenderer, remote} = require('electron');
var app = remote.require('./app.js');
var axolotl = require('axolotl');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/keyserver'; // Temp

// Queries keyserver with FBID and returns keybundle
var getPubKey = function(FBID) {
	// Establish connection to keyserver
	MongoClient.connect(url, function(err, db) {
		if (err) {
			ipcRenderer.send('mongodb', 'Unable to connect to MongoDB server. Error: ' + err); // Debugging
		} else {
			ipcRenderer.send('mongodb', 'Database connection established to: ' + url); // Debugging

			var collection = db.collection('keys');
			collection.find({fbid: FBID});

			// TO-DO: Pull keybundle from queried document, return in parsable format

			db.close();
		}
	});
}

/* MongoDB Crash Course (running local environment):
 * Open two terminal windows, initialize MongoDB 
 * localhost with the 'mongod' command in first
 * window. Now, once you run the MongoClient code,
 * the 'keyserver' database and 'keys' collection
 * will be dynamically created. Connect to MongoDB
 * shell in second window with the 'mongo' command.
 * To view local databases, type 'show dbs'. To
 * enter keyserver database, type 'use keyserver'.
 * To view collections, type 'show collections'
 * (you're probably getting the idea now). To switch
 * into a keys collection, type 'use keys'. To view
 * documents in collection, type 'db.keys.find()'.
 * Reference the 'mongod' daemon for debugging stuff.
*/

// Encrypts plaintext using Axolotl
var encrypt = function(plaintext, FBID) {
	var pubKey = getPubKey(FBID);

	// TO-DO: Return encrypted plaintext with pubKey
}

// Decrypts either received or sent crypto
var decrypt = function(crypto, state) {
	if (state == true) {
		// TO-DO: Decrypt inbound message
	} else {
		// TO-DO: Decrypt outbound message
	}
}

// MAIN

onload = function() {
	// TO-DO: Detect when ReactDevTools is loaded

	// Scrapes React components and virtual DOM
	var elementData = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.elementData.values(); 
	var elts = []; var done = false;
	while (!done) {   
		var iter = elementData.next();   
		done = iter.done;   
		elts.push(iter.value); 
	}

	// Targets composer and input components
	window.composer = elts.filter(function(elt) {
		return elt != null && elt.name=="r [from MessengerComposer.react]";
	})[0];
	window.input = elts.filter(function(elt) {
		return elt != null && elt.name == "r [from MessengerComposerInput.react]";
	})[0];

	// Pulls FBIDs for current session
	window.friendFBID = window.composer.publicInstance.props.threadFBID;
	window.yourFBID = window.composer.publicInstance.props.viewer;

	ipcRenderer.send('fbid', {yourFBID: yourFBID, friendFBID: friendFBID}); // Sends FBIDs to main process

	// Scrapes, decrypts, and replaces encrypted messages in main conversation
	var getMainMessages = function() {
		var containerNode = document.getElementsByClassName('__i_')[0];
		containerNode.childNodes.forEach(function(child) {
			if (child.tagName == 'DIV' && child.id.length > 0) {
				child.childNodes.forEach(function(c) {
					if (c.tagName == 'DIV') {
						var msgWrapperNodes = c.childNodes[0].getElementsByClassName('clearfix');
						for (var i = 0; i < msgWrapperNodes.length; i++) {
							var msgNode = msgWrapperNodes[i].childNodes[0].childNodes[0];
							
							// Detects if message is rich media content
							if (msgNode == undefined || msgNode == null) {
								continue;
							}

							// Detects if message is encrypted
							if (msgNode.innerHTML.indexOf('-----BEGIN PGP MESSAGE-----') == 0) {
								// TO-DO: Detect if message is from friend or user

								if (fromFriend == true) {
									msgNode.innerHTML = decrypt(msgNode.innerHTML, true);
								} else {
									msgNode.innerHTML = decrypt(msgNode.innerHTML, false);
								}
							}
						}
					}
				});
			}
		});
		/*
		var containerNode = document.getElementsByClassName('_3oh-\ _58nk');
		for (var i = 0; i < containerNode.length; i++) {
			containerNode[i].innerHTML = decrypt(containerNode.innerHTML);
		}
		*/
	}

	// Scrapes, decrypts, and replaces encrypted message thumbnails in recent conversations
	var getThumbMessages = function() {
		var sideMaster = document.getElementsByClassName('_1htf');
		for (i = 0; i < sideMaster.length; i++) {
			// Detects if message is from user or friend
			if (sideMaster[i].innerHTML.indexOf('You: ') == 0) {
				if (sideMaster[i].innerHTML.indexOf('-----BEGIN PGP MESSAGE-----') == 5) {
					sideMaster[i].innerHTML = 'You: ' + decrypt(sideMaster[i].innerHTML.slice(5), false);
				}
			} else if (sideMaster[i].innerHTML.indexOf('-----BEGIN PGP MESSAGE-----') == 0) {
				sideMaster[i].innerHTML = decrypt(sideMaster[i].innerHTML, true);
			}
		}
	}

	getMainMessages();
	getThumbMessages();

	// Listens for session change (new convo) and decrypts new messages
	var newSession = new MutationObserver(function(muts) {
		muts.forEach(function(mut) {
			if (mut.attributeName == 'aria-relevant') {
				var id = mut.target.firstChild.id.split(':')[1];
				if (id != window.yourFBID) {
					window.friendFBID = window.composer.publicInstance.props.threadFBID; // Updates global FBID
					getMainMessages();
					getThumbMessages();
				}
			}
		});
	});

	// Decrypts newfound messages in main conversation when user scrolls up
	var mainScroll = new MutationObserver(function(muts) {
		muts.forEach(function(mut) {
			if (mut.attributeName == 'id' || mut.attributeName == 'class') {
				getMainMessages();
			}
		});
	});

	// Decrypts newfound message thumbnails in recent conversations when user scrolls down
	var thumbScroll;

	// Listens for and decrypts new message in main conversation
	var msgReceiveMain;

	// Listens for and decrypts new message in recent conversations
	var msgReceiveThumb;

	// Mutation Observer globals
	var sessionTarg = document.getElementsByClassName('uiScrollableAreaContent').item(0);
	var mainScrollTarg = document.getElementsByClassName('__i_')[0];
	var thumbScrollTarg;
	var attributes = {attributes: true, subtree: true};

	newSession.observe(sessionTarg, attributes);
	mainScroll.observe(mainScrollTarg, attributes);
	thumbScroll;
	msgReceiveMain;
	msgReceiveThumb;

	ipcRenderer.send('preprocessed', true); // Sends injection status to main process
}

// BRAINSTORMING

// Detects when a user starts typing
document.onkeyup = function newMessage(e) {
	var key = e.which || e.keyCode;
	if (key == 13) {
		console.log('Enter pressed.');
	} else {
		var text = document.activeElement.textContent;
		console.log(text);
	}
}

// Intercepts outbound messages for encryption
var f = window.composer.publicInstance.props.onMessageSend.bind(window.composer.publicInstance);

window.composer.publicInstance.props.onMessageSend = function(p) {
    var encrypted = p + 'MODIFIED';
    f(encrypted);
    // Reset input state
}

// _5l-3 _1ht1; aria-label="Conversation List" "uiScrollableAreaContent" aria-label="Conversations"

// I forgot what this does
$(document).on("DOMNodeInserted", function(e) {
	if ($(e.target).hasClass("")) { 
		console.log($(e.target).children()); 
	};
});

// Outbound encrypted messages need to be signed so that they can be decrypted