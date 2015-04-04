'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var pipelines = require('../../app/controllers/pipelines.server.controller');

	// Pipelines Routes
	app.route('/pipelines')
		.get(pipelines.list)
		.post(users.requiresLogin, pipelines.create);

	app.route('/pipelines/:pipelineId')
		.get(pipelines.read)
		.put(users.requiresLogin, pipelines.hasAuthorization, pipelines.update)
		.delete(users.requiresLogin, pipelines.hasAuthorization, pipelines.delete);

	// Finish by binding the Pipeline middleware
	app.param('pipelineId', pipelines.pipelineByID);
};
