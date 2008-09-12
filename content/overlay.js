//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//

// Monkeypatch the Dopploadr string bundle
var strings = document.createElement('stringbundle');
strings.id = 'strings';
strings.setAttribute('src', 'chrome://dopploadr/locale/overlay.properties');
document.getElementById('locale').parentNode.appendChild(strings);

// Ask them to auth with Dopplr after login
extension.after_login.add(function(user) {
	Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
		.logStringMessage('after_login! user: ' + user.toSource());

	// Maybe we're already auth'ed with Dopplr?
userinfo.unset('dopplr_token');
	if (userinfo.get('dopplr_token')) {
		Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
			.logStringMessage('dopplr_token: ' + userinfo.get('dopplr_token'));
		return;
	}

	// See if we should auth with Dopplr
	if (!confirm(strings.getString('dopploadr.login.alert.text'),
		strings.getString('dopploadr.login.alert.title'))) {
		return;
	}

	// Auth with Dopplr
	launch_browser('https://www.dopplr.com/api/AuthSubRequest?scope=http://www.dopplr.com&next=http://dopploadr.rcrowley.org/token/&session=1');

	// Be prepared to take the dopplr callback string when they paste it in
	var token = prompt(strings.getString('dopploadr.login.prompt.text'),
		strings.getString('dopploadr.login.prompt.title'));
	http.get('https://www.dopplr.com/api/AuthSubSessionToken', {
		'token': token
	}, function(xhr) {
		Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
			.logStringMessage(xhr.responseText);
		var parse = xhr.responseText.match(/^Token=(.*)\nExpiration=(.*)$/);
		if (parse) {
			Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
				.logStringMessage('dopplr_token: ' + parse[1]);
			userinfo.set('dopplr_token', parse[1]);
		}
	});

});

// Remove existing geotags and update Dopploadr status bar
extension.after_logout.add(function() {
	Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
		.logStringMessage('after_logout!');

	// TODO

});
