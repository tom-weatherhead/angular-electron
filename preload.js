if (typeof require !== 'undefined' && typeof window !== 'undefined') {
	window.fnInitElectron = () => {
		// To get this to work, ../node_modules/electron/index.js must look like this:
		// module.exports = '/usr/local/Git/GitHubSandbox/tom-weatherhead/angular-electron/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'
		// ... i.e. Don't try to use Node.js's 'fs' or 'path' modules from inside the browser.
		const {
			// app,
			// autoUpdater,
			clipboard,
			// contentTracing,
			contextBridge,
			crashReporter,
			desktopCapturer,
			// dialog,
			// globalShortcut,
			// inAppPurchase,
			// ipcMain,
			ipcRenderer,
			nativeImage,
			// nativeTheme,
			// net,
			// netLog,
			// powerMonitor,
			// powerSaveBlocker,
			// protocol,
			remote,
			// screen,
			// session,
			shell,
			// systemPreferences,
			// webContents,
			webFrame // ,
			// webviewTag
		} = require('electron');

		// console.log('clipboard is:', typeof clipboard, clipboard);
		// console.log('contextBridge is:', typeof contextBridge, contextBridge);
		// console.log('crashReporter is:', typeof crashReporter, crashReporter);
		// console.log('desktopCapturer is:', typeof desktopCapturer, desktopCapturer);
		// console.log('ipcRenderer is:', typeof ipcRenderer, ipcRenderer);
		// console.log('nativeImage is:', typeof nativeImage, nativeImage);
		// console.log('remote is:', typeof remote, remote);
		// console.log('shell is:', typeof shell, shell);
		// console.log('webFrame is:', typeof webFrame, webFrame);
		// console.log('webviewTag is:', typeof webviewTag, webviewTag);

		const {
			app,
			autoUpdater,
			contentTracing,
			dialog,
			globalShortcut,
			// inAppPurchase, // 2020-03-26 : Currently exclude this for win32
			ipcMain,
			nativeTheme,
			net,
			// netLog, // (electron) 'currentlyLoggingPath' is deprecated and will be removed.
			powerMonitor,
			powerSaveBlocker,
			protocol,
			screen,
			session,
			systemPreferences,
			webContents // ,
			// webviewTag
		} = require('electron').remote;

		// console.log('app is:', typeof app, app);
		// console.log('autoUpdater is:', typeof autoUpdater, autoUpdater);
		// console.log('contentTracing is:', typeof contentTracing, contentTracing);
		// console.log('dialog is:', typeof dialog, dialog);
		// console.log('globalShortcut is:', typeof globalShortcut, globalShortcut);
		// console.log('inAppPurchase is:', typeof inAppPurchase, inAppPurchase);
		// console.log('ipcMain is:', typeof ipcMain, ipcMain);
		// console.log('nativeTheme is:', typeof nativeTheme, nativeTheme);
		// console.log('net is:', typeof net, net);
		// console.log('netLog is:', typeof netLog, netLog);
		// console.log('powerMonitor is:', typeof powerMonitor, powerMonitor);
		// console.log('powerSaveBlocker is:', typeof powerSaveBlocker, powerSaveBlocker);
		// console.log('protocol is:', typeof protocol, protocol);
		// console.log('screen is:', typeof screen, screen);
		// console.log('session is:', typeof session, session);
		// console.log('systemPreferences is:', typeof systemPreferences, systemPreferences);
		// console.log('webContents is:', typeof webContents, webContents);
		// console.log('webviewTag is:', typeof webviewTag, webviewTag);

		return {
			app: app,
			autoUpdater: autoUpdater,
			clipboard: clipboard,
			// const contentTracing: ContentTracing;
			contextBridge: contextBridge,
			crashReporter: crashReporter,
			desktopCapturer: desktopCapturer,
			// const dialog: Dialog;
			// const globalShortcut: GlobalShortcut;
			// const inAppPurchase: InAppPurchase;
			// const ipcMain: IpcMain;
			ipcRenderer: ipcRenderer,
			nativeImage: nativeImage,
			// const nativeTheme: NativeTheme;
			// const netLog: NetLog;
			net: net,
			// const powerMonitor: PowerMonitor;
			// const powerSaveBlocker: PowerSaveBlocker;
			// const protocol: Protocol;
			// const remote: Remote;
			remote: remote,
			screen: screen,
			// type session = Session;
			// const session: typeof Session;
			shell: shell,
			systemPreferences: systemPreferences,
			// type webContents = WebContents;
			// const webContents: typeof WebContents;
			// const webFrame: WebFrame;
			webFrame: webFrame
			// const webviewTag: WebviewTag;
		};
	};
}
