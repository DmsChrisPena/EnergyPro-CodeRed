'use strict';

// Contracts controller
angular.module('contracts').controller('ContractsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contracts',
	function($scope, $stateParams, $location, Authentication, Contracts) {
		$scope.authentication = Authentication;

		// Create new Contract
		$scope.create = function() {
			// Create new Contract object
			var contract = new Contracts ({
				name: this.name
			});

			// Redirect after save
			contract.$save(function(response) {
				$location.path('contracts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contract
		$scope.remove = function(contract) {
			if ( contract ) { 
				contract.$remove();

				for (var i in $scope.contracts) {
					if ($scope.contracts [i] === contract) {
						$scope.contracts.splice(i, 1);
					}
				}
			} else {
				$scope.contract.$remove(function() {
					$location.path('contracts');
				});
			}
		};

		// Update existing Contract
		$scope.update = function() {
			var contract = $scope.contract;

			contract.$update(function() {
				$location.path('contracts/' + contract._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contracts
		$scope.find = function() {
			$scope.contracts = Contracts.query();
		};

		// Find existing Contract
		$scope.findOne = function() {
			$scope.contract = Contracts.get({ 
				contractId: $stateParams.contractId
			});
		};
	}
]);