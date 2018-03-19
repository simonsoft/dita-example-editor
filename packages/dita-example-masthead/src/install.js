define([
	'fontoxml-modular-ui/uiManager',

	'./Masthead.jsx'
], function (
	uiManager,

	Masthead
) {
	'use strict';

	return function install () {
		// By registering a component to the special name 'Masthead' we can let Fonto know this is the component
		// that contains all toolbars and should be rendered at the top of the app.
		//
		// More info:
		// http://documentation.fontoxml.com/editor/latest/create-a-masthead-3099042.html
		uiManager.registerReactComponent('Masthead', Masthead);
	};
});
