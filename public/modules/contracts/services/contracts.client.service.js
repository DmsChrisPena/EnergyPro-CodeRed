'use strict';

//Contracts service used to communicate Contracts REST endpoints
angular.module('contracts').factory('Contracts', ['$resource',
	function($resource) {
		return $resource('contracts/:contractId', { contractId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);