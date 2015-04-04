'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Contract = mongoose.model('Contract'),
	_ = require('lodash');

/**
 * Create a Contract
 */
exports.create = function(req, res) {
	var contract = new Contract(req.body);
	contract.user = req.user;

	contract.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contract);
		}
	});
};

/**
 * Show the current Contract
 */
exports.read = function(req, res) {
	res.jsonp(req.contract);
};

/**
 * Update a Contract
 */
exports.update = function(req, res) {
	var contract = req.contract ;

	contract = _.extend(contract , req.body);

	contract.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contract);
		}
	});
};

/**
 * Delete an Contract
 */
exports.delete = function(req, res) {
	var contract = req.contract ;

	contract.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contract);
		}
	});
};

/**
 * List of Contracts
 */
exports.list = function(req, res) { 
	Contract.find().sort('-created').populate('user', 'displayName').exec(function(err, contracts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contracts);
		}
	});
};

/**
 * Contract middleware
 */
exports.contractByID = function(req, res, next, id) { 
	Contract.findById(id).populate('user', 'displayName').exec(function(err, contract) {
		if (err) return next(err);
		if (! contract) return next(new Error('Failed to load Contract ' + id));
		req.contract = contract ;
		next();
	});
};

/**
 * Contract authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.contract.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
