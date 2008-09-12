//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//
// Arbitrary key-value store associated with the current Flickr user.
// (This should really be part of the extension API but I blew it.)
//

var userinfo = {
	set: function(k, v) {

		// Only allow userinfo if they're signed into Flickr
		if (!users.nsid) { return false; }

		// It's just a hash for storing whatever you want
		var u = users.list[users.nsid];
		u.userinfo = u.userinfo || {};
		u.userinfo[k] = v;

		return true;
	},
	get: function(k) {
		if (!users.nsid) { return undefined; }
		if (!users.list[users.nsid].userinfo) { return undefined; }
		return users.list[users.nsid].userinfo[k];
	},
	unset: function(k) {
		if (!users.nsid) { return true; }
		if (!users.list[users.nsid].userinfo) { return true; }
		delete users.list[users.nsid].userinfo[k];
		return true;
	}
};
