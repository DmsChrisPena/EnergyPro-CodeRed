'use strict';

//Pipelines service used to communicate Pipelines REST endpoints
angular.module('pipelines').factory('Pipelines', ['$resource',
	function($resource) {
		return $resource('pipelines/:pipelineId', { pipelineId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);