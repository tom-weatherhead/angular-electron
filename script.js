// angular-electron/script.js

// Note: This script is loaded via angular.json

if (typeof require !== 'undefined' && typeof window !== 'undefined') {
	// This is required by Bootstrap:
	// Note: jQuery cannot be loaded by the Electron preload.js script
	// because createElement() cannot yet be called.
	window.$ = window.jQuery = require('jquery');
}
