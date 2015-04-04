'use strict';

// Configuring the Articles module
angular.module('contracts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Contracts', 'contracts', 'dropdown', '/contracts(/create)?');
		Menus.addSubMenuItem('topbar', 'contracts', 'List Contracts', 'contracts');
		Menus.addSubMenuItem('topbar', 'contracts', 'New Contract', 'contracts/create');
	}
]);