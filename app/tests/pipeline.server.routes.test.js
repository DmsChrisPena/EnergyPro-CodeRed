'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Pipeline = mongoose.model('Pipeline'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, pipeline;

/**
 * Pipeline routes tests
 */
describe('Pipeline CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Pipeline
		user.save(function() {
			pipeline = {
				name: 'Pipeline Name'
			};

			done();
		});
	});

	it('should be able to save Pipeline instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pipeline
				agent.post('/pipelines')
					.send(pipeline)
					.expect(200)
					.end(function(pipelineSaveErr, pipelineSaveRes) {
						// Handle Pipeline save error
						if (pipelineSaveErr) done(pipelineSaveErr);

						// Get a list of Pipelines
						agent.get('/pipelines')
							.end(function(pipelinesGetErr, pipelinesGetRes) {
								// Handle Pipeline save error
								if (pipelinesGetErr) done(pipelinesGetErr);

								// Get Pipelines list
								var pipelines = pipelinesGetRes.body;

								// Set assertions
								(pipelines[0].user._id).should.equal(userId);
								(pipelines[0].name).should.match('Pipeline Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Pipeline instance if not logged in', function(done) {
		agent.post('/pipelines')
			.send(pipeline)
			.expect(401)
			.end(function(pipelineSaveErr, pipelineSaveRes) {
				// Call the assertion callback
				done(pipelineSaveErr);
			});
	});

	it('should not be able to save Pipeline instance if no name is provided', function(done) {
		// Invalidate name field
		pipeline.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pipeline
				agent.post('/pipelines')
					.send(pipeline)
					.expect(400)
					.end(function(pipelineSaveErr, pipelineSaveRes) {
						// Set message assertion
						(pipelineSaveRes.body.message).should.match('Please fill Pipeline name');
						
						// Handle Pipeline save error
						done(pipelineSaveErr);
					});
			});
	});

	it('should be able to update Pipeline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pipeline
				agent.post('/pipelines')
					.send(pipeline)
					.expect(200)
					.end(function(pipelineSaveErr, pipelineSaveRes) {
						// Handle Pipeline save error
						if (pipelineSaveErr) done(pipelineSaveErr);

						// Update Pipeline name
						pipeline.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Pipeline
						agent.put('/pipelines/' + pipelineSaveRes.body._id)
							.send(pipeline)
							.expect(200)
							.end(function(pipelineUpdateErr, pipelineUpdateRes) {
								// Handle Pipeline update error
								if (pipelineUpdateErr) done(pipelineUpdateErr);

								// Set assertions
								(pipelineUpdateRes.body._id).should.equal(pipelineSaveRes.body._id);
								(pipelineUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Pipelines if not signed in', function(done) {
		// Create new Pipeline model instance
		var pipelineObj = new Pipeline(pipeline);

		// Save the Pipeline
		pipelineObj.save(function() {
			// Request Pipelines
			request(app).get('/pipelines')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Pipeline if not signed in', function(done) {
		// Create new Pipeline model instance
		var pipelineObj = new Pipeline(pipeline);

		// Save the Pipeline
		pipelineObj.save(function() {
			request(app).get('/pipelines/' + pipelineObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', pipeline.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Pipeline instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Pipeline
				agent.post('/pipelines')
					.send(pipeline)
					.expect(200)
					.end(function(pipelineSaveErr, pipelineSaveRes) {
						// Handle Pipeline save error
						if (pipelineSaveErr) done(pipelineSaveErr);

						// Delete existing Pipeline
						agent.delete('/pipelines/' + pipelineSaveRes.body._id)
							.send(pipeline)
							.expect(200)
							.end(function(pipelineDeleteErr, pipelineDeleteRes) {
								// Handle Pipeline error error
								if (pipelineDeleteErr) done(pipelineDeleteErr);

								// Set assertions
								(pipelineDeleteRes.body._id).should.equal(pipelineSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Pipeline instance if not signed in', function(done) {
		// Set Pipeline user 
		pipeline.user = user;

		// Create new Pipeline model instance
		var pipelineObj = new Pipeline(pipeline);

		// Save the Pipeline
		pipelineObj.save(function() {
			// Try deleting Pipeline
			request(app).delete('/pipelines/' + pipelineObj._id)
			.expect(401)
			.end(function(pipelineDeleteErr, pipelineDeleteRes) {
				// Set message assertion
				(pipelineDeleteRes.body.message).should.match('User is not logged in');

				// Handle Pipeline error error
				done(pipelineDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Pipeline.remove().exec();
		done();
	});
});