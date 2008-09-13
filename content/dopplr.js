//
// Dopplr API
// Richard Crowley <r@rcrowley.org>
//

const dopplr = {
	endpoint: 'https://www.dopplr.com/api/',

	traveller_info: function(traveller, callback) {
		this._api(
			'traveller_info',
			traveller ? {'traveller': traveller} : {},
			callback
		);
	},

	// The real meat of the API call
	_api: function(method, params, callback) {
		params['format'] = 'js';
		params['token']  = userinfo.get('dopplr_token');
		http.get(this.endpoint + method, params, function(xhr) {
			if ('function' == typeof callback) {
				callback(json.decode(xhr.responseText));
			}
		});
	}

};
