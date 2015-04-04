'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contract Schema
 */
var ContractSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Contract name',
		trim: true
	},
	contract_number: {
		type: String,
		default: '',
		trim: true
	},
	con_type: {
		type: String,
		default: '',
		trim: true
	},
	transport_cost: {
		type: Number,
		default: '',
		trim: true
	},
	days_effective: {
		type: Number,
		default: '',
		trim: true
	},
	expected_profit: {
		type: Number,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Contract', ContractSchema);