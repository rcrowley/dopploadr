//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//
// Monkeypatching new events into the Uploadr extension API.
//

users.old_logout = users.logout;
users.logout = function(save) {
	users.old_logout(save);
	extension.after_logout.exec();
};
extension.after_logout = new extension.Handler();
