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
	if (userinfo.get('dopplr_token')) {
		dopploadr.check_token(function(authed) { dopploadr._auth(authed); });
	}

	// Nope, auth
	else { dopploadr.auth(); }

});

// Remove existing geotags and update Dopploadr status bar
extension.after_logout.add(function() {
	Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService)
		.logStringMessage('after_logout!');

	// TODO

});

// After a batch of photos is added, save the geo data for later
//   TODO: Cache date -> geo data
extension.after_thumb.add(function(id) {
	var d = photos.list[id].date_taken.match(/^(\d{4})[-:](\d{2})[-:](\d{2})/);
	dopplr.location_on_date(d[1] + '-' + d[2] + '-' + d[3], function(loc) {
		//photos.list[id].tags = meta.tags(photos.list[id].tags, tags);
		photos.list[id].geo = {
			lat: loc.location.trip.city.latitude,
			lon: loc.location.trip.city.longitude,
			tags: [
				loc.location.trip.city.name.toLowerCase().replace(/\s/, ''),
				'geonames:locality=' + loc.location.trip.city.geoname_id,
				'dopplr:trip=' + loc.location.trip.id
			]
		};
	});
	Components.utils.reportError(photos.list[id].toSource());
});
