//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//
// Send HTTP requests
//   The callback function will be passed an XMLHttpRequest as its
//   only parameter.
//

var http = {

	get: function(url, params, callback, headers) {
		return this.request('GET', url, params, callback, headers);
	},
	post: function(url, params, callback, headers) {
		return this.request('POST', url, params, callback, headers);	
	},

	request: function(verb, url, params, callback, headers) {
		var esc = [];
		for (var p in params) {
			esc.push(encodeURIComponent(p) + '=' +
				encodeURIComponent(params[p]));
		}
		var xhr = new XMLHttpRequest();
		xhr.mozBackgroundRequest = true;
		xhr.open(verb, url + ('GET' == verb ? '?' + esc.join('&') : ''), true);
		xhr.onreadystatechange = function() {
			if (4 != xhr.readyState) { return; }
			if ('function' == typeof callback) { callback(xhr); }
		};
		xhr.setRequestHeader('Content-Type',
			'application/x-www-form-urlencoded');
		if (null !== headers) {
			for (var h in headers) { xhr.setRequestHeader(h, headers[h]); }
		}
		xhr.send('POST' == verb ? esc.join('&') : '');
	}

};
