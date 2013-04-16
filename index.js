var util = require('util'),
	request = require('request'),
	_ = require('lodash');

var Elsa = function () { };

Elsa.prototype = {
	port: 9200,

	config: function (options) {
		var protocol = options.secure ? 'https://' : 'http://';
		this.port = this.port || options.port;
		this.url = [protocol + options.host, this.port].join(':');
		this.searchIndex = options.index;
		this.searchType = options.type;
	},

	/*
	 * optional: type
	 */
	index: function (type, documents, callback) {
		if (arguments.length == 2) {
			callback = documents;
			documents = type;
			type = this.searchType;
		}

		if (!(documents instanceof Array)) documents = [documents];

		var commands = '',
			idField = '_id';

		documents.forEach(function (d) {
			commands +=
				JSON.stringify({index: {_id: d[idField].toString()}}) + "\n" +
				JSON.stringify(d) + "\n";
		});

		request.post(
			{
				url: this._url(type) + '/_bulk',
				body: commands
			},
			callback
		);
	},

	/*
	 * options is, naturally, optional
	 */
	multiMatch: function (type, queryStr, fields, options, callback) {
		if (arguments.length == 4) {
			callback = options;
			options = null;
		}

		return this.search(
			type,
			{multi_match: {query: queryStr, fields: fields}},
			options,
			callback
		);
	},

	/*
	 * optional: searchOptions
	 */
	search: function (type, searchObj, searchOptions, callback) {
		var queryObj = {query: searchObj};

		if (arguments.length == 3) {
			callback = searchOptions;
		} else {
			if (searchOptions)
				_.assign(queryObj, searchOptions);
		}

		request.get(
			{
				url: this._url(type) + '/_search',
				body: JSON.stringify(queryObj)
			},
			function (err, res, body) {
				if (err) {
					callback(err, null);
					return;
				}

				callback(null, JSON.parse(body));
			}
		);
	},

	remove: function (type) {
		var url = this._url(type, null),
			objId,
			callback;

		if (arguments.length == 2) {
			callback = arguments[1];
		} else {
			objId = arguments[1];
			callback = arguments[2];
			url += '/' + objId.toString();
		}

		request({method: 'delete', url: url}, callback);
	},

	_url: function (type, index) {
		index = index || this.searchIndex;
		return [this.url, index, type].join('/');
	}
};

module.exports = new Elsa();
