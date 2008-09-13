//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//

const dopploadr = {

	// Call the callback with true if the current Flickr user has a
	// valid Dopplr token and false otherwise
	check_token: function(callback) {
		dopplr.traveller_info(null, function(xhr) {
			callback('AuthSub required.' != xhr.responseText);
		});
	},

	// Start the auth process with Dopplr
	auth: function(callback) {
		if (null === callback) { this._auth; }

		// See if we should auth with Dopplr
		if (!confirm(strings.getString('dopploadr.login.alert.text'),
			strings.getString('dopploadr.login.alert.title'))) {
			if ('function' == typeof callback) { callback(false); }
			return;
		}

		// Auth with Dopplr
		launch_browser('https://www.dopplr.com/api/AuthSubRequest?' +
			'scope=http://www.dopplr.com&' +
			'next=http://dopploadr.rcrowley.org/token/&' +
			'session=1');

		// Be prepared to take the dopplr callback string when they paste it in
		var token = prompt(strings.getString('dopploadr.login.prompt.text'),
			strings.getString('dopploadr.login.prompt.title'));
		http.get('https://www.dopplr.com/api/AuthSubSessionToken', {
			'token': token
		}, function(xhr) {
			var parse = xhr.responseText
				.match(/^Token=(.*)\nExpiration=(.*)$/);
			if (parse) {
				Cc['@mozilla.org/consoleservice;1']
					.getService(Ci.nsIConsoleService)
					.logStringMessage('dopplr_token: ' + parse[1]);
				userinfo.set('dopplr_token', parse[1]);
				if ('function' == typeof callback) { callback(false); }
			}
		});

	},

	// Update the UI and maybe 
	_auth: function(authed) {
		if (authed) {
			dopplr.traveller_info(null, function(t) {
				dopploadr.status(strings.getFormattedString(
					'dopploadr.status.authed', [t.traveller.nick]));
			});
		} else {
			this.status(strings.getString('dopploadr.status'));
			// TODO: Click-to-auth
		}
	},

	status: function(s) {
		document.getElementById('dopploadr-status').label = s;
	}

};
