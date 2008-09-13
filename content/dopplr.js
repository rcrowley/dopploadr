//
// Dopplr API
// Richard Crowley <r@rcrowley.org>
//

const dopplr = {
	endpoint: 'https://www.dopplr.com/api/',

	traveller_info: function(traveller, callback) {
		var params = {
			'format': 'js',
			'token': userinfo.get('dopplr_token')
		};
		if (traveller) { params['traveller'] = traveller }
		http.get(this.endpoint + 'traveller_info', params, function(xhr) {
			callback(json.decode(xhr.responseText));
		});
	}

};
