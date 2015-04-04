'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Contract = mongoose.model('Contract'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, contract;

/**
 * Contract routes tests
 */
describe('Contract CRUD tests', function() {
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

		// Save a user to the test db and create new Contract
		user.save(function() {
			contract = {
				name: 'Contract Name'
			};

			done();
		});
	});

	it('should be able to save Contract instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contract
				agent.post('/contracts')
					.send(contract)
					.expect(200)
					.end(function(contractSaveErr, contractSaveRes) {
						// Handle Contract save error
						if (contractSaveErr) done(contractSaveErr);

						// Get a list of Contracts
						agent.get('/contracts')
							.end(function(contractsGetErr, contractsGetRes) {
								// Handle Contract save error
								if (contractsGetErr) done(contractsGetErr);

								// Get Contracts list
								var contracts = contractsGetRes.body;

								// Set assertions
								(contracts[0].user._id).should.equal(userId);
								(contracts[0].name).should.match('Contract Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Contract instance if not logged in', function(done) {
		agent.post('/contracts')
			.send(contract)
			.expect(401)
			.end(function(contractSaveErr, contractSaveRes) {
				// Call the assertion callback
				done(contractSaveErr);
			});
	});

	it('should not be able to save Contract instance if no name is provided', function(done) {
		// Invalidate name field
		contract.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contract
				agent.post('/contracts')
					.send(contract)
					.expect(400)
					.end(function(contractSaveErr, contractSaveRes) {
						// Set message assertion
						(contractSaveRes.body.message).should.match('Please fill Contract name');
						
						// Handle Contract save error
						done(contractSaveErr);
					});
			});
	});

	it('should be able to update Contract instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contract
				agent.post('/contracts')
					.send(contract)
					.expect(200)
					.end(function(contractSaveErr, contractSaveRes) {
						// Handle Contract save error
						if (contractSaveErr) done(contractSaveErr);

						// Update Contract name
						contract.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Contract
						agent.put('/contracts/' + contractSaveRes.body._id)
							.send(contract)
							.expect(200)
							.end(function(contractUpdateErr, contractUpdateRes) {
								// Handle Contract update error
								if (contractUpdateErr) done(contractUpdateErr);

								// Set assertions
								(contractUpdateRes.body._id).should.equal(contractSaveRes.body._id);
								(contractUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Contracts if not signed in', function(done) {
		// Create new Contract model instance
		var contractObj = new Contract(contract);

		// Save the Contract
		contractObj.save(function() {
			// Request Contracts
			request(app).get('/contracts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Contract if not signed in', function(done) {
		// Create new Contract model instance
		var contractObj = new Contract(contract);

		// Save the Contract
		contractObj.save(function() {
			request(app).get('/contracts/' + contractObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', contract.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Contract instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Contract
				agent.post('/contracts')
					.send(contract)
					.expect(200)
					.end(function(contractSaveErr, contractSaveRes) {
						// Handle Contract save error
						if (contractSaveErr) done(contractSaveErr);

						// Delete existing Contract
						agent.delete('/contracts/' + contractSaveRes.body._id)
							.send(contract)
							.expect(200)
							.end(function(contractDeleteErr, contractDeleteRes) {
								// Handle Contract error error
								if (contractDeleteErr) done(contractDeleteErr);

								// Set assertions
								(contractDeleteRes.body._id).should.equal(contractSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Contract instance if not signed in', function(done) {
		// Set Contract user 
		contract.user = user;

		// Create new Contract model instance
		var contractObj = new Contract(contract);

		// Save the Contract
		contractObj.save(function() {
			// Try deleting Contract
			request(app).delete('/contracts/' + contractObj._id)
			.expect(401)
			.end(function(contractDeleteErr, contractDeleteRes) {
				// Set message assertion
				(contractDeleteRes.body.message).should.match('User is not logged in');

				// Handle Contract error error
				done(contractDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Contract.remove().exec();
		done();
	});
});