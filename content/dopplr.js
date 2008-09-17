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

	location_on_date: function(d, callback) {
		this._api('location_on_date', {'date': d}, callback);
	},

	// The real meat of the API call
	_api: function(method, params, callback) {
		var url = this.endpoint + method;
		params['format'] = 'js';
		params['token']  = userinfo.get('dopplr_token');
		http.get(url, params, function(xhr) {
			if ('function' == typeof callback) {
				var obj = json.decode(xhr.responseText);
				if (null === obj) {
					Components.utils.reportError('dopplr._api received null');
					http.get(url, params, arguments.callee);
				} else { callback(obj); }
			}
		});
	}

};
