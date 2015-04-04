'use strict';

// Pipelines controller
angular.module('pipelines').controller('PipelinesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pipelines',
	function($scope, $stateParams, $location, Authentication, Pipelines) {
		$scope.authentication = Authentication;

		// Create new Pipeline
		$scope.create = function() {
			// Create new Pipeline object
			var pipeline = new Pipelines ({
				name: this.name
			});

			// Redirect after save
			pipeline.$save(function(response) {
				$location.path('pipelines/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pipeline
		$scope.remove = function(pipeline) {
			if ( pipeline ) { 
				pipeline.$remove();

				for (var i in $scope.pipelines) {
					if ($scope.pipelines [i] === pipeline) {
						$scope.pipelines.splice(i, 1);
					}
				}
			} else {
				$scope.pipeline.$remove(function() {
					$location.path('pipelines');
				});
			}
		};

		// Update existing Pipeline
		$scope.update = function() {
			var pipeline = $scope.pipeline;

			pipeline.$update(function() {
				$location.path('pipelines/' + pipeline._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pipelines
		$scope.find = function() {
			$scope.pipelines = Pipelines.query();
		};

		// Find existing Pipeline
		$scope.findOne = function() {
			$scope.pipeline = Pipelines.get({ 
				pipelineId: $stateParams.pipelineId
			});
		};
	}
]);