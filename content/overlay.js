//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//

// Ask them to auth with Dopplr after login
extension.after_login.add(function(user) {
	Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
		.logStringMessage('after_login! user: ' + user.toSource());

	// Testing userinfo
	var a = userinfo.get('dopploadr');
	var b = userinfo.set('dopploadr', true);
	var c = userinfo.get('dopploadr');
	var d = userinfo.unset('dopploadr');
	var e = userinfo.get('dopploadr');

	// TODO

});

// Remove existing geotags and update Dopploadr status bar
extension.after_logout.add(function() {
	Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
		.logStringMessage('after_logout!');

	// TODO

});
