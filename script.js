if (typeof require !== 'undefined' && typeof window !== 'undefined') {
	// This is required by Bootstrap:
	// Note: jQuery cannot be loaded by the Electron preload.js script
	// because createElement() cannot yet be called.
	window.$ = window.jQuery = require('jquery');
}

// Chart.js : Load Chart.min.css and Chart.min.js explicitly
// in the header of index.html before this:

if (typeof Chart !== 'undefined') {
	// Content Security Policy: disable automatic style injection
	Chart.platform.disableCSSInjection = true;
}
