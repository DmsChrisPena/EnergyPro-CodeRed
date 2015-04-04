'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Company name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	city: {
		type: String,
		default: '',
		trim: true
	},
	state: {
		type: String,
		default: '',
		trim: true
	},
	industry: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Company', CompanySchema);