// SystemJS module definition
// declare var module: NodeModule;

// declare module 'electron';

declare const nodeModule: NodeModule;

interface NodeModule {
	id: string;
}

interface Window {
	readonly innerHeight: number;
	readonly innerWidth: number;
	readonly outerHeight: number;
	readonly outerWidth: number;
	process: {
		arch: string;
		argv: string[];
		execPath: string;
		isMainFrame: boolean;
		moduleLoadList: string[];
		pid: number;
		platform: string;
		release: {
			lts: string;
			name: string;
		};
		type: string; // I.e. renderer
		version: string;
	};
	require: NodeRequireFunction;
	// screen: {
	// 	availHeight: number;
	// 	availLeft: number;
	// 	availTop: number;
	// 	availWidth: number;
	// 	height: number;
	// 	width: number;
	// };
	readonly screen: Screen;
}
