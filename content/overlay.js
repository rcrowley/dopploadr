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

	// Warn them and then take them to Dopplr for auth
	if (confirm(strings.getString('dopploadr.login.alert.text'),
		strings.getString('dopploadr.login.alert.title'))) {
		launch_browser('http://www.dopplr.com/api/AuthSubRequest?scope=http://www.dopplr.com&next=http://dopploadr.rcrowley.org/auth/&session=1');
		asdf();
	}

});

// Remove existing geotags and update Dopploadr status bar
extension.after_logout.add(function() {
	Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
		.logStringMessage('after_logout!');

	// TODO

});
