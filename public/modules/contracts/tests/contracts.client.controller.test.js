'use strict';

(function() {
	// Contracts Controller Spec
	describe('Contracts Controller Tests', function() {
		// Initialize global variables
		var ContractsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Contracts controller.
			ContractsController = $controller('ContractsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Contract object fetched from XHR', inject(function(Contracts) {
			// Create sample Contract using the Contracts service
			var sampleContract = new Contracts({
				name: 'New Contract'
			});

			// Create a sample Contracts array that includes the new Contract
			var sampleContracts = [sampleContract];

			// Set GET response
			$httpBackend.expectGET('contracts').respond(sampleContracts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contracts).toEqualData(sampleContracts);
		}));

		it('$scope.findOne() should create an array with one Contract object fetched from XHR using a contractId URL parameter', inject(function(Contracts) {
			// Define a sample Contract object
			var sampleContract = new Contracts({
				name: 'New Contract'
			});

			// Set the URL parameter
			$stateParams.contractId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/contracts\/([0-9a-fA-F]{24})$/).respond(sampleContract);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.contract).toEqualData(sampleContract);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Contracts) {
			// Create a sample Contract object
			var sampleContractPostData = new Contracts({
				name: 'New Contract'
			});

			// Create a sample Contract response
			var sampleContractResponse = new Contracts({
				_id: '525cf20451979dea2c000001',
				name: 'New Contract'
			});

			// Fixture mock form input values
			scope.name = 'New Contract';

			// Set POST response
			$httpBackend.expectPOST('contracts', sampleContractPostData).respond(sampleContractResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Contract was created
			expect($location.path()).toBe('/contracts/' + sampleContractResponse._id);
		}));

		it('$scope.update() should update a valid Contract', inject(function(Contracts) {
			// Define a sample Contract put data
			var sampleContractPutData = new Contracts({
				_id: '525cf20451979dea2c000001',
				name: 'New Contract'
			});

			// Mock Contract in scope
			scope.contract = sampleContractPutData;

			// Set PUT response
			$httpBackend.expectPUT(/contracts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/contracts/' + sampleContractPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid contractId and remove the Contract from the scope', inject(function(Contracts) {
			// Create new Contract object
			var sampleContract = new Contracts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Contracts array and include the Contract
			scope.contracts = [sampleContract];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/contracts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleContract);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.contracts.length).toBe(0);
		}));
	});
}());