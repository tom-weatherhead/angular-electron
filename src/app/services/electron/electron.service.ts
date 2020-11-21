// angular-electron/src/app/services/electron/electron.service.ts

// // If you import a module but never use any of the imported values other than as TypeScript types,
// // the resulting javascript file will look as if you never imported the module at all.
// The imports in this group just import type information:
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
// import * as process from 'process';

import {
	// Inject,
	Injectable
} from '@angular/core';

// See https://www.electronjs.org/docs/api

import {
	app,
	// App,
	BrowserView,
	BrowserWindow, // Available to the Main process, not the Renderer process
	// BrowserWindowProxy, // Returned to the Renderer process by window.open()
	clipboard, // Clipboard,			// Not yet used
	// ContextBridge,		// Not yet used
	crashReporter, // Not yet used
	desktopCapturer, // Not yet used
	Display,
	// Dock,
	// ipcMain,
	ipcRenderer,
	IpcRendererEvent,
	// Menu,
	// nativeImage, // Not yet used
	// Net,					// Not yet used
	// process,
	remote,
	screen,
	shell, // Not yet used
	// SystemPreferences,	// Not yet used
	// TouchBar,
	// Tray,
	webFrame
} from 'electron';

// E.g. This returns a BrowserWindow:
// window.open('https://github.com', '_blank', 'nodeIntegration=no');

// From node_modules/@types/node/child_process.d.ts :

interface ExecException extends Error {
	cmd?: string;
	killed?: boolean;
	code?: number;
	signal?: NodeJS.Signals;
}

function isElectronAvailable(): boolean {
	return !!(window && window.process && window.process.type);
}

@Injectable({
	providedIn: 'root'
})
export class ElectronService {
	private app: typeof app;
	private browserView: typeof BrowserView;
	private clipboard: typeof clipboard;
	private crashReporter: typeof crashReporter;
	private desktopCapturer: typeof desktopCapturer;
	private _ipcRenderer: typeof ipcRenderer;
	private process: typeof process;
	private remote: typeof remote;
	private screen: typeof screen;
	private shell: typeof shell;
	private webFrame: typeof webFrame;

	private _childProcess: typeof childProcess;
	private _fs: typeof fs;
	private _os: typeof os;
	private _path: typeof path;
	// private _process: typeof process;

	constructor() {
		if (isElectronAvailable()) {
			const electron = window.require('electron');

			this.app = electron.remote.app;
			// this.browserWindow = electron.remote.browserWindow;
			this.clipboard = electron.clipboard;
			this.crashReporter = electron.crashReporter;
			this.desktopCapturer = electron.desktopCapturer;
			this._ipcRenderer = electron.ipcRenderer;
			this.process = electron.remote.process;
			this.screen = electron.screen;
			this.shell = electron.shell;
			this.webFrame = electron.webFrame;

			// If you want to use remote objects, please set enableRemoteModule to true in main.ts
			this.remote = electron.remote;

			this._childProcess = window.require('child_process');
			this._fs = window.require('fs');
			this._os = window.require('os');
			this._path = window.require('path');

			// console.log('process.sandboxed :', this.process.sandboxed);
			// console.log('process.type :', this.process.type);
			// console.log(
			// 	'process.versions.chrome :',
			// 	this.process.versions.chrome
			// );
			// console.log(
			// 	'process.versions.electron :',
			// 	this.process.versions.electron
			// );
			// console.log(
			// 	'process.getCreationTime() :',
			// 	this.process.getCreationTime()
			// );
			// console.log(
			// 	'process.getCPUUsage() :',
			// 	this.process.getCPUUsage()
			// );
			// console.log(
			// 	'process.getHeapStatistics() :',
			// 	this.process.getHeapStatistics()
			// );
			// console.log(
			// 	'process.getSystemMemoryInfo() :',
			// 	this.process.getSystemMemoryInfo()
			// );
			// console.log(
			// 	'process.getSystemVersion() :',
			// 	this.process.getSystemVersion()
			// );

			// console.log(
			// 	'clipboard.availableFormats:',
			// 	this.clipboard.availableFormats()
			// ); // -> 'text/plain'

			// console.log(
			// 	'Setting handler for Electron event: gpu-info-update'
			// );
			this.app.on(
				'gpu-info-update',
				(event: { preventDefault: () => void }) => {
					event.preventDefault();
					console.log('Electron event: gpu-info-update');

					// GPUFeatureStatus on macOS when Electron hardware acceleration is enabled:

					// 2d_canvas: "enabled"
					// flash_3d: "enabled"
					// flash_stage3d: "enabled"
					// flash_stage3d_baseline: "enabled"
					// gpu_compositing: "enabled"
					// metal: "disabled_off"
					// multiple_raster_threads: "enabled_on"
					// oop_rasterization: "enabled"
					// opengl: "enabled_on"
					// protected_video_decode: "unavailable_off"
					// rasterization: "enabled"
					// skia_renderer: "disabled_off_ok"
					// video_decode: "enabled"
					// webgl: "enabled"
					// webgl2: "enabled"

					// When Electron hardware acceleration is disabled:

					// 2d_canvas: "unavailable_software"
					// flash_3d: "disabled_software"
					// flash_stage3d: "disabled_software"
					// flash_stage3d_baseline: "disabled_software"
					// gpu_compositing: "disabled_software"
					// metal: "disabled_off"
					// multiple_raster_threads: "enabled_on"
					// oop_rasterization: "disabled_off"
					// opengl: "disabled_off"
					// protected_video_decode: "disabled_off"
					// rasterization: "disabled_software"
					// skia_renderer: "disabled_off_ok"
					// video_decode: "disabled_software"
					// webgl: "unavailable_software"
					// webgl2: "unavailable_software"

					console.log(
						'GPUFeatureStatus:',
						this.app.getGPUFeatureStatus()
					);
				}
			);
		}
	}

	public get isAvailable(): boolean {
		return isElectronAvailable();
	}

	public get ipcRenderer(): typeof ipcRenderer {
		return this._ipcRenderer;
	}

	public get childProcess(): typeof childProcess {
		return this._childProcess;
	}

	public get fs(): typeof fs {
		return this._fs;
	}

	public get os(): typeof os {
		return this._os;
	}

	public get path(): typeof path {
		return this._path;
	}

	// public get process(): typeof process {
	// 	return this.process;
	// }

	public cwd(): string {
		return this.process.cwd();
	}

	public openGitHubInBrowser(): void {
		this.shell.openExternal('https://github.com');
	}

	public getSelectedTextFromClipboard(): string {
		return this.clipboard.readText('selection');
	}

	public showAboutPanel(): void {
		this.app.showAboutPanel();
	}

	// childProcess.exec() returns a ChildProcess:

	// interface ChildProcess extends events.EventEmitter {
	// 	stdin: Writable | null;
	// 	stdout: Readable | null;
	// 	stderr: Readable | null;
	// 	readonly channel?: Pipe | null;
	// 	readonly stdio: [
	// 		Writable | null, // stdin
	// 		Readable | null, // stdout
	// 		Readable | null, // stderr
	// 		Readable | Writable | null | undefined, // extra
	// 		Readable | Writable | null | undefined // extra
	// 	];
	// 	readonly killed: boolean;
	// 	readonly pid: number;
	// 	readonly connected: boolean;
	// 	readonly exitCode: number | null;
	// 	readonly signalCode: number | null;
	// 	readonly spawnargs: string[];
	// 	readonly spawnfile: string;
	// 	kill(signal?: NodeJS.Signals | number): boolean;
	// 	send(message: any, callback?: (error: Error | null) => void): boolean;
	// 	send(message: any, sendHandle?: net.Socket | net.Server, callback?: (error: Error | null) => void): boolean;
	// 	send(message: any, sendHandle?: net.Socket | net.Server, options?: MessageOptions, callback?: (error: Error | null) => void): boolean;
	// 	disconnect(): void;
	// 	unref(): void;
	// 	ref(): void;

	// 	/**
	// 	* events.EventEmitter
	// 	* 1. close
	// 	* 2. disconnect
	// 	* 3. error
	// 	* 4. exit
	// 	* 5. message
	// 	*/

	// 	addListener(event: string, listener: (...args: any[]) => void): this;
	// 	addListener(event: "close", listener: (code: number, signal: NodeJS.Signals) => void): this;
	// 	addListener(event: "disconnect", listener: () => void): this;
	// 	addListener(event: "error", listener: (err: Error) => void): this;
	// 	addListener(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
	// 	addListener(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

	// 	emit(event: string | symbol, ...args: any[]): boolean;
	// 	emit(event: "close", code: number, signal: NodeJS.Signals): boolean;
	// 	emit(event: "disconnect"): boolean;
	// 	emit(event: "error", err: Error): boolean;
	// 	emit(event: "exit", code: number | null, signal: NodeJS.Signals | null): boolean;
	// 	emit(event: "message", message: any, sendHandle: net.Socket | net.Server): boolean;

	// 	on(event: string, listener: (...args: any[]) => void): this;
	// 	on(event: "close", listener: (code: number, signal: NodeJS.Signals) => void): this;
	// 	on(event: "disconnect", listener: () => void): this;
	// 	on(event: "error", listener: (err: Error) => void): this;
	// 	on(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
	// 	on(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

	// 	once(event: string, listener: (...args: any[]) => void): this;
	// 	once(event: "close", listener: (code: number, signal: NodeJS.Signals) => void): this;
	// 	once(event: "disconnect", listener: () => void): this;
	// 	once(event: "error", listener: (err: Error) => void): this;
	// 	once(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
	// 	once(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

	// 	prependListener(event: string, listener: (...args: any[]) => void): this;
	// 	prependListener(event: "close", listener: (code: number, signal: NodeJS.Signals) => void): this;
	// 	prependListener(event: "disconnect", listener: () => void): this;
	// 	prependListener(event: "error", listener: (err: Error) => void): this;
	// 	prependListener(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
	// 	prependListener(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;

	// 	prependOnceListener(event: string, listener: (...args: any[]) => void): this;
	// 	prependOnceListener(event: "close", listener: (code: number, signal: NodeJS.Signals) => void): this;
	// 	prependOnceListener(event: "disconnect", listener: () => void): this;
	// 	prependOnceListener(event: "error", listener: (err: Error) => void): this;
	// 	prependOnceListener(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): this;
	// 	prependOnceListener(event: "message", listener: (message: any, sendHandle: net.Socket | net.Server) => void): this;
	// }

	public executeChildProcess(command: string): Promise<string> {
		return new Promise<string>(
			(
				resolve: (value?: string) => void,
				reject: (reason?: unknown) => void
			): void => {
				this.childProcess.exec(
					command,
					(
						error: ExecException | null,
						stdout: string,
						stderr: string
					): void => {
						const execException = error as ExecException;

						if (execException) {
							console.error(
								'execException:',
								typeof execException,
								execException
							);
							reject(execException);
						} else if (error) {
							console.error(
								'childProcess.exec error:',
								typeof error,
								error
							);
							reject(error);
						} else if (stderr) {
							console.error(
								'childProcess.exec stderr:',
								typeof stderr,
								stderr
							);
							reject(stderr);
						} else {
							// console.log(
							// 	'childProcess.exec stdout:\n',
							// 	stdout
							// );
							resolve(stdout);
						}
					}
				);
			}
		);
	}

	public sendAsynchronousMessage(
		channel: string,
		...args: unknown[]
	): void {
		// Angular sends an Electron IPC message to the Electron main process.

		if (isElectronAvailable()) {
			this.ipcRenderer.send(channel, ...args);
		}
	}

	// public addAsynchronousReplyListener(
	// 	channel: string,
	// 	fnListener: (event: IpcRendererEvent, ...args: unknown[]) => void
	// ): void {
	// 	// Angular receives a message from the Electron main process.
	// 	// This message could be a reply to a previous message sent from
	// 	// the Electron main process to Angular.

	// 	if (isElectronAvailable()) {
	// 		this.ipcRenderer.on(channel, fnListener);
	// 	}
	// }

	public addAsynchronousReplyOneTimeListener(
		channel: string,
		fnListener: (event: IpcRendererEvent, ...args: unknown[]) => void
	): void {
		if (isElectronAvailable()) {
			this.ipcRenderer.once(channel, fnListener);
		}
	}

	// public sendAsynchronousMessageWithOneTimeListener(messageName: string,
	// fnListener: (event: IpcRendererEvent, ...argss: any[]) => void,
	// ...args: any[]): void {

	// 	const messageType = 'asynchronous';
	// 	const messageChannel = messageType + '-message';
	// 	const replyChannel = messageType + '-reply';

	// 	this.addAsynchronousReplyOneTimeListener(replyChannel, fnListener);
	// 	this.sendAsynchronousMessage(messageChannel, messageName);
	// }

	public getPrimaryDisplay(): Display {
		if (!isElectronAvailable()) {
			throw new Error('Electron is not available');
		} else if (!this.screen) {
			throw new Error('this.screen is falsy');
		} else {
			return this.screen.getPrimaryDisplay();
		}
	}

	public getCurrentWindow(): BrowserWindow {
		if (!isElectronAvailable()) {
			throw new Error('Electron is not available');
		} else if (!this.remote) {
			throw new Error('this.remote is falsy');
		} else {
			return this.remote.getCurrentWindow();
		}
	}

	public setProgressBarValue(n: number): Promise<boolean> {
		if (!isElectronAvailable()) {
			return Promise.reject(new Error('Electron is not available'));
		}

		return new Promise<boolean>(
			(
				resolve: (value?: boolean) => void,
				reject: (reason?: unknown) => void
			): void => {
				this.addAsynchronousReplyOneTimeListener(
					'set-progress-bar-value-reply',
					(event: IpcRendererEvent, ...args: unknown[]): void => {
						// console.log('setProgressBarValue() : set-progress-bar-value-reply reply:', args.length, ...args);

						if (args.length === 1 && args[0] === true) {
							// console.log('setProgressBarValue() : ProgressBarValue successfully set to', n);

							resolve(true);
						} else {
							reject(
								new Error(
									'Could not set the ProgressBarValue'
								)
							);
						}
					}
				);

				this.sendAsynchronousMessage(
					'set-progress-bar-value-message',
					n
				);
			}
		);
	}
}
