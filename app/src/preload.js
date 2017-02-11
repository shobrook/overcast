// DOM LISTENERS
	// onload: decrypts any crypto on-screen when messenger first loads
	// newMessage: intercepts plaintext on message send, encrypts and replaces w/ crypto
	// mainScroll: decrypts newfound messages in main window when a user scrolls up
	// thumbScroll: decrypts message thumbnails when user scrolls down recent convos window
	// newSession: observes when user changes conversations, decrypts messages in main window
	// msgReceiveMain: listens for new message in main window and decrypts
	// msgReceiveThumb: listens for new message in recent convos window and decrypts

// METHODS
	// getFBID(): returns friend's FBID for current session
	// getPubKey(window.FBID): queries MongoDB and returns keybundle associated w/ a given FBID
	// encrypt(plaintext, window.FBID): encrypts plaintext given a recipient's FBID
	// decrypt(crypto): decrypts a string of crypto
	// getMainMessages(): scrapes, decrypts, and replaces encrypted messages in main window
	// getThumbMessages(): scrapes, decrypts, and replaces encrypted messages in recent convos window

// GLOBALS
	// window.friendFBID: friend's FBID for current session

var encrypt = function(plaintext, FBID) {

}

var decrypt = function(crypto) {

}

var getPubKey = function(FBID) {

}

onload = function() {
	var getMainMessages = function() {
		var containerNode = document.getElementsByClassName('__i_')[0];
		containerNode.childNodes.forEach(function(child) {
			if (child.tagName == 'DIV' && child.id.length > 0) {
				child.childNodes.forEach(function(c) {
					if (c.tagName == 'DIV') {
						var msgWrapperNodes = c.childNodes[0].getElementsByClassName('clearfix');
						for (var i = 0; i < msgWrapperNodes.length; i++) {
							var msgNode = msgWrapperNodes[i].childNodes[0].childNodes[0];
							if (msgNode == undefined || msgNode == null) {
								continue;
							}
							if (msgNode.innerHTML.indexOf('-----BEGIN PGP MESSAGE-----') == 0) {
								msgNode.innerHTML = decrypt(msgNode.innerHTML);
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

	var getThumbMessages = function() {
		var sideMaster = document.getElementsByClassName('_1htf');
		for (i = 0; i < sideMaster.length; i++) {
			// TO-DO: Check if text is encrypted, keep the 'You: '
			sideMaster[i].innerHTML = decrypt(sideMaster[i].innerHTML);
		}
	}

	getMainMessages();
	getThumbMessages();

	var getFBID = function() {

	}

	window.friendFBID = getFBID();

	document.onkeyup = function newMessage(e) {
		var key = e.which || e.keyCode;
		if (key == 13) {
			console.log('Enter pressed.');
		} else {
			var text = document.activeElement.textContent;
			console.log(text);
		}
	}

	var newSession = new MutationObserver(function(muts) {
		muts.forEach(function(mut) {
			if (mut.attributeName == 'aria-relevant') {
				var id = mut.target.firstChild.id.split(':')[1];
				if (id != window.friendFBID) {
					window.friendFBID = id;
				}
			}
		});
	});

	var mainScroll = new MutationObserver(function(muts) {
		muts.forEach(function(mut) {
			if (mut.attributeName == 'id' || mut.attributeName == 'class') {
				getMainMessages();
			}
		});
	});

	var thumbScroll = null;

	var msgReceiveMain = null;

	var msgReceiveThumb = null;


	newSession.observe(document.getElementsByClassName('uiScrollableAreaContent').item(0), {attributes: true, subtree: true});
	mainScroll.observe(document.getElementsByClassName('__i_')[0], {attributes: true, subtree: true});
	thumbScroll;
	msgReceiveMain;
	msgReceiveThumb;
}

// PROBLEMS
	// Outbound encrypted messages need to show up as plaintext in the main window and conversation thumbnail
	// When the main window is first loaded, not only do inbound messages need to be decrypted but so do outbound

// BRAINSTORMING

var elementData = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent.elementData.values(); 
var elts = []; var done = false; 
while (!done) {   
	var iter = elementData.next();   
	done = iter.done;   
	elts.push(iter.value); 
}

window.composer = elts.filter(function(elt) { return elt != null && elt.name=="r [from MessengerComposer.react]"; })[0];
window.input = elts.filter(function(elt) { return elt != null && elt.name == "r [from MessengerComposerInput.react]"; })[0];
// window.send = elts.filter(function(elt) { return elt != null && elt.name == "l [from MessengerSendButton.react]"; })[0]; // Only works once a user starts typing
window.composer.publicInstance.props.threadFBID;

var f = window.composer.publicInstance.props.onMessageSend.bind(window.composer.publicInstance);

window.composer.publicInstance.props.onMessageSend = function(p) {
    var encrypted = p + 'MODIFIED';
    f(encrypted);
    // Reset input state
} 

_5l-3 _1ht1; aria-label="Conversation List" "uiScrollableAreaContent" aria-label="Conversations"

$( document ).on( "DOMNodeInserted", function( e ) {
	if ($(e.target).hasClass("")) { console.log($(e.target).children()); };  // the new element	
});