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
		Components.utils.reportError(loc.toSource());
		//photos.list[id].tags = meta.tags(photos.list[id].tags, tags);
		var c = loc.location.trip ? loc.location.trip.city : loc.location.home;
		photos.list[id].geo = {
			lat: c.latitude,
			lon: c.longitude,
			tags: [
				c.name.toLowerCase().replace(/\s/, ''),
				'geonames:locality=' + c.geoname_id
			]
		};
		if (loc.location.trip) {
			photos.list[id].geo.tags.push(
				'dopplr:trip=' + loc.location.trip_id);
		}
		Components.utils.reportError(photos.list[id].geo.toSource());
	});
});

// Just before uploading a photo, add in the geo-related tags saved earlier
extension.before_one_upload.add(function(photo) {
	if (!photo.geo) { return; }
	photo.tags = meta.tags(photo.tags, photo.geo.tags.join(' '));
});

// Geotag photos as they successfully upload
//   11 is the accuracy level for a city
extension.after_one_upload.add(function(photo, success) {
	if (!success || !photo.geo) { return; }
	flickr.photos.geo.setLocation(null, users.token, photo.photo_id, photo.geo.lat, photo.geo.lon, 11);
});
