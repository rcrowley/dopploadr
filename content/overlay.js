//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//

// Enable/disable the Upload button monkeypatch
const monkeypatch_upload = true;

// Monkeypatch the Dopploadr string bundle
var strings = document.createElement('stringbundle');
strings.id = 'strings';
strings.setAttribute('src', 'chrome://dopploadr/locale/overlay.properties');
document.getElementById('locale').parentNode.appendChild(strings);

// Monkeypatch the big Upload button to pay attention to the API queue
if (monkeypatch_upload) {
	buttons.upload._enable = buttons.upload.enable;
	buttons.upload.enable = function() {
		if (dopploadr._queue) { return; }
		buttons.upload._enable();
	};
}

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

// Block uploads until the Dopplr calls have all returned
extension.after_add.add(function(list) { dopploadr.queue(list.length); });

// After a photo is added, save the geo data for later
//   The extension API should really be passing the photo object - my bad
//   TODO: Cache date -> geo data
extension.after_thumb.add(function(id) {
	var photo = photos.list[id];
	var d = photo.date_taken.match(/^(\d{4})[-:](\d{2})[-:](\d{2})/);
	dopplr.location_on_date(d[1] + '-' + d[2] + '-' + d[3], function(l) {
		var c = l.location.trip ? l.location.trip.city : l.location.home;
		var tags = [
			c.name.toLowerCase().replace(/\s/g, ''),
			'woe:id=' + c.woeid,
			'geonames:locality=' + c.geoname_id
		];
		if (c.region) {
			tags.push(c.region.toLowerCase().replace(/\s/g, ''));
		}
		if (c.country) {
			tags.push(c.country.toLowerCase().replace(/\s/g, ''));
		}
		if (l.location.trip) {
			tags.push('dopplr:trip=' + l.location.trip.id);
		}
		photo.geo = {
			'lat': c.latitude,
			'lon': c.longitude,
			'tags': tags
		};
		dopploadr.dequeue();
		if (monkeypatch_upload) { buttons.upload.enable(); }
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
	flickr.photos.geo.setLocation(null, users.token, photo.photo_id,
		photo.geo.lat, photo.geo.lon, 11);
});
