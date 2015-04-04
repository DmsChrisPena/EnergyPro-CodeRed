'use strict';

(function() {
	// Pipelines Controller Spec
	describe('Pipelines Controller Tests', function() {
		// Initialize global variables
		var PipelinesController,
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

			// Initialize the Pipelines controller.
			PipelinesController = $controller('PipelinesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pipeline object fetched from XHR', inject(function(Pipelines) {
			// Create sample Pipeline using the Pipelines service
			var samplePipeline = new Pipelines({
				name: 'New Pipeline'
			});

			// Create a sample Pipelines array that includes the new Pipeline
			var samplePipelines = [samplePipeline];

			// Set GET response
			$httpBackend.expectGET('pipelines').respond(samplePipelines);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pipelines).toEqualData(samplePipelines);
		}));

		it('$scope.findOne() should create an array with one Pipeline object fetched from XHR using a pipelineId URL parameter', inject(function(Pipelines) {
			// Define a sample Pipeline object
			var samplePipeline = new Pipelines({
				name: 'New Pipeline'
			});

			// Set the URL parameter
			$stateParams.pipelineId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pipelines\/([0-9a-fA-F]{24})$/).respond(samplePipeline);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pipeline).toEqualData(samplePipeline);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pipelines) {
			// Create a sample Pipeline object
			var samplePipelinePostData = new Pipelines({
				name: 'New Pipeline'
			});

			// Create a sample Pipeline response
			var samplePipelineResponse = new Pipelines({
				_id: '525cf20451979dea2c000001',
				name: 'New Pipeline'
			});

			// Fixture mock form input values
			scope.name = 'New Pipeline';

			// Set POST response
			$httpBackend.expectPOST('pipelines', samplePipelinePostData).respond(samplePipelineResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pipeline was created
			expect($location.path()).toBe('/pipelines/' + samplePipelineResponse._id);
		}));

		it('$scope.update() should update a valid Pipeline', inject(function(Pipelines) {
			// Define a sample Pipeline put data
			var samplePipelinePutData = new Pipelines({
				_id: '525cf20451979dea2c000001',
				name: 'New Pipeline'
			});

			// Mock Pipeline in scope
			scope.pipeline = samplePipelinePutData;

			// Set PUT response
			$httpBackend.expectPUT(/pipelines\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pipelines/' + samplePipelinePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pipelineId and remove the Pipeline from the scope', inject(function(Pipelines) {
			// Create new Pipeline object
			var samplePipeline = new Pipelines({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pipelines array and include the Pipeline
			scope.pipelines = [samplePipeline];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pipelines\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePipeline);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pipelines.length).toBe(0);
		}));
	});
}());