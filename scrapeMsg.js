//find and replace messages
var findMessages = function() {
	var containerNode = document.getElementsByClassName('__i_')[0];
	containerNode.childNodes.forEach(function(child) {
		if (child.tagName == 'DIV' && child.id.length > 0) {
			child.childNodes.forEach(function(c) {
				if (c.tagName == 'DIV') {
					var msgWrapperNodes = c.childNodes[0].getElementsByClassName('clearfix'); // Alternatives: ('_41ud')[0].gEBCN('clearfix')
					for (var i = 0; i < msgWrapperNodes.length; i++) {
						var msgNode = msgWrapperNodes[i].childNodes[0].childNodes[0]; 
						if (msgNode === undefined || msgNode === null) {
							continue; 
						}
						msgNode.innerHTML = 'decrypted'; // Need a decrypt() method
					}
				}
			});
		}
	});
}
var target = document.getElementsByClassName('__i_')[0];
var config = {attributes: true, subtree: true};
var msgObserver = new MutationObserver(function(muts) { //find&replace new messages upon update
	muts.forEach(function(mut) {
		if (mut.attributeName == 'id' || mut.attributeName == 'class') {
			console.log('User has scrolled.');
			findMessages();
		}
	});
});

msgObserver.observe(target, config);

//listen on textfield
document.onkeyup = function(e) { 
	var key = e.which || e.keyCode; if (key == 13) { 
		console.log('Enter pressed.'); 
		} else { 
			var text = document.activeElement.textContent
			console.log(text); 
		} 
	}
