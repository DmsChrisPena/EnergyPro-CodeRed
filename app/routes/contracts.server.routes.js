'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var contracts = require('../../app/controllers/contracts.server.controller');

	// Contracts Routes
	app.route('/contracts')
		.get(contracts.list)
		.post(users.requiresLogin, contracts.create);

	app.route('/contracts/:contractId')
		.get(contracts.read)
		.put(users.requiresLogin, contracts.hasAuthorization, contracts.update)
		.delete(users.requiresLogin, contracts.hasAuthorization, contracts.delete);

	// Finish by binding the Contract middleware
	app.param('contractId', contracts.contractByID);
};
