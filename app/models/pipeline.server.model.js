'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pipeline Schema
 */
var PipelineSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Pipeline name',
		trim: true
	},
	points: {
		type: String,
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

mongoose.model('Pipeline', PipelineSchema);