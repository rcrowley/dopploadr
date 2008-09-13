//
// Dopploadr
// Richard Crowley <r@rcrowley.org>
//

var json = {
	_xpcom: Cc['@mozilla.org/dom/json;1'].createInstance(Ci.nsIJSON),
	encode: function(obj) {
		try { return this._xpcom.encode(obj); }
		catch (err) { return ''; }
	},
	decode: function(str) {
		try { return this._xpcom.decode(str); }
		catch (err) { return null; }
	}
};

