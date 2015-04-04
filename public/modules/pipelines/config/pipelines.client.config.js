'use strict';

// Configuring the Articles module
angular.module('pipelines').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pipelines', 'pipelines', 'dropdown', '/pipelines(/create)?');
		Menus.addSubMenuItem('topbar', 'pipelines', 'List Pipelines', 'pipelines');
		Menus.addSubMenuItem('topbar', 'pipelines', 'New Pipeline', 'pipelines/create');
	}
]);