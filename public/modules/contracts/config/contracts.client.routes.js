'use strict';

//Setting up route
angular.module('contracts').config(['$stateProvider',
	function($stateProvider) {
		// Contracts state routing
		$stateProvider.
		state('listContracts', {
			url: '/contracts',
			templateUrl: 'modules/contracts/views/list-contracts.client.view.html'
		}).
		state('createContract', {
			url: '/contracts/create',
			templateUrl: 'modules/contracts/views/create-contract.client.view.html'
		}).
		state('viewContract', {
			url: '/contracts/:contractId',
			templateUrl: 'modules/contracts/views/view-contract.client.view.html'
		}).
		state('editContract', {
			url: '/contracts/:contractId/edit',
			templateUrl: 'modules/contracts/views/edit-contract.client.view.html'
		});
	}
]);