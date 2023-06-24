/**
 * AJAX call management
 */

	function makeCall(method, url, formElement, cback, reset = true) {
	    var req = new XMLHttpRequest(); // visible by closure
	    req.onreadystatechange = function() {
	      cback(req)
	    }; // closure
	    req.open(method, url);
	    if (formElement == null) {
	      req.send();
	    } else {
			let formData=new FormData(formElement);
			console.log(formData.get("itemName"));
	      req.send(formData);
	    }
	    if (formElement !== null && reset === true) {
	      formElement.reset();
	    }
	  }
