'use strict';

//Setting up route
angular.module('pipelines').config(['$stateProvider',
	function($stateProvider) {
		// Pipelines state routing
		$stateProvider.
		state('listPipelines', {
			url: '/pipelines',
			templateUrl: 'modules/pipelines/views/list-pipelines.client.view.html'
		}).
		state('createPipeline', {
			url: '/pipelines/create',
			templateUrl: 'modules/pipelines/views/create-pipeline.client.view.html'
		}).
		state('viewPipeline', {
			url: '/pipelines/:pipelineId',
			templateUrl: 'modules/pipelines/views/view-pipeline.client.view.html'
		}).
		state('editPipeline', {
			url: '/pipelines/:pipelineId/edit',
			templateUrl: 'modules/pipelines/views/edit-pipeline.client.view.html'
		});
	}
]);