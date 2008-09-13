//
// Flickr API extensions
// Richard Crowley <r@rcrowley.org>
//
// Extensions to the Flickr API as defined in Uploadr's flickr.js
//

if (!flickr.photos.geo) { flickr.photos.geo = {}; }

flickr.photos.geo.setLocation =
	function(callback, token, photo_id, lat, lon, accuracy) {
	api.start({
		'method': 'flickr.photos.geo.setLocation',
		'auth_token': token,
		'photo_id': photo_id,
		'lat': lat,
		'lon': lon,
		'accuracy': accuracy
	}, callback, null, null, true);
};
