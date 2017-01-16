//init  var containerNode = document.getElementsByClassName('__i_')[0];

containerNode.childNodes.forEach(function(child) { //console.log(child);
    if (child.tagName == 'DIV' && child.id.length > 0) {
        child.childNodes.forEach(function(c) { //console.log(c);
        	if (c.tagName == 'DIV') {
                var msgWrapperNodes = c.childNodes[0].getElementsByClassName('clearfix'); 
                console.log(msgWrapperNodes); console.log(msgWrapperNodes.length);
				for (var i = 0; i < msgWrapperNodes.length; i++) {
					var msgNode = msgWrapperNodes[i].childNodes[0].childNodes[0]; console.log(msgNode.innerHTML);
					msgNode.innerHTML = 'suck my bussy';
		      }
        }
      });
    }
  });
