'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Pipeline = mongoose.model('Pipeline'),
	_ = require('lodash');

/**
 * Create a Pipeline
 */
exports.create = function(req, res) {
	var pipeline = new Pipeline(req.body);
	pipeline.user = req.user;

	pipeline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pipeline);
		}
	});
};

/**
 * Show the current Pipeline
 */
exports.read = function(req, res) {
	res.jsonp(req.pipeline);
};

/**
 * Update a Pipeline
 */
exports.update = function(req, res) {
	var pipeline = req.pipeline ;

	pipeline = _.extend(pipeline , req.body);

	pipeline.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pipeline);
		}
	});
};

/**
 * Delete an Pipeline
 */
exports.delete = function(req, res) {
	var pipeline = req.pipeline ;

	pipeline.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pipeline);
		}
	});
};

/**
 * List of Pipelines
 */
exports.list = function(req, res) { 
	Pipeline.find().sort('-created').populate('user', 'displayName').exec(function(err, pipelines) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(pipelines);
		}
	});
};

/**
 * Pipeline middleware
 */
exports.pipelineByID = function(req, res, next, id) { 
	Pipeline.findById(id).populate('user', 'displayName').exec(function(err, pipeline) {
		if (err) return next(err);
		if (! pipeline) return next(new Error('Failed to load Pipeline ' + id));
		req.pipeline = pipeline ;
		next();
	});
};

/**
 * Pipeline authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.pipeline.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
