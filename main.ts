// angular-electron/main.ts

// import * as fs from 'fs';
import * as os from 'os';

// const { promisify } = require('util');

import {
	app,
	BrowserWindow,
	ipcMain,
	Menu,
	screen,
	TouchBar,
	Tray
} from 'electron';

// The line below requires "resolveJsonModule": true in the compilerOptions in tsconfig.main.json
import * as packageJson from './package.json';

const applicationName = packageJson.name;
const applicationVersion = packageJson.version;

// console.log('screen is', typeof screen, screen);

// const promisifiedReadFile = promisify(readFile);
// const promisifiedReadFile = fs.promises.readFile;

// const process = require('process');

// console.log('allowedNodeEnvironmentFlags:', process.allowedNodeEnvironmentFlags);

const platform = os.platform(); // TODO? : Use process.platform instead?
// const isPlatformWindows = platform === 'win32';
const isPlatformMac = platform === 'darwin';
const isPlatformLinux = platform === 'linux';

// const screen = !isPlatformWindows && require('electron').screen;

let win: BrowserWindow;

// macOS: The screen is 1680x1050 (??? I thought it was 2880x1800. The difference between logical pixels and device pixels, I would guess.)

// For Windows 10 VM with 1920x1200 display:
// const browserWindowWidth = 1200;
// const browserWindowHeight = 850;

const iconsDir = __dirname + '/dist/assets/icons/';

const defaultIconFilePath = iconsDir + 'tom-weatherhead-512x512.png';
const defaultTrayIconFilePath = iconsDir + 'magenta-20x20.png';

const macOsAppIconFilePath = defaultIconFilePath;

const linuxTrayIconFilePath = defaultTrayIconFilePath;
const macOsTrayIconFilePath = defaultTrayIconFilePath;
const windowsTrayIconFilePath = iconsDir + 'favicon.ico';

function setDockMenu() {
	if (!isPlatformMac) {
		return;
	}

	const dockMenu = Menu.buildFromTemplate([
		{
			label: 'New Window',
			click() {
				console.log('New Window');
			}
		},
		{
			label: 'New Window with Settings',
			submenu: [
				{
					label: 'Basic'
				},
				{
					label: 'Pro'
				}
			]
		},
		{
			label: 'New Foo Command...'
		}
	]);

	app.dock.setMenu(dockMenu);
	app.dock.setIcon(macOsAppIconFilePath);
}

function turnTouchBarOn() {
	if (!isPlatformMac) {
		return;
	}

	const {
		/* TouchBarLabel, */ TouchBarButton /*, TouchBarSpacer */
	} = TouchBar;

	const touchBarButton = new TouchBarButton({
		label: 'Buckwheat',
		backgroundColor: '#7851A9',
		click: () => {
			console.log('Hello Buckwheat!');
			win.webContents.send('touchbar-button-toggle-angular-colour');
		}
	});
	const touchBar = new TouchBar({
		items: [
			// spin,
			// new TouchBarSpacer({ size: 'large' }),
			// reel1,
			// new TouchBarSpacer({ size: 'small' }),
			// reel2,
			// new TouchBarSpacer({ size: 'small' }),
			// reel3,
			// new TouchBarSpacer({ size: 'large' }),
			// result
			touchBarButton
		]
	});

	win.setTouchBar(touchBar);
}

function turnTouchBarOff() {
	if (!isPlatformMac) {
		return;
	}

	win.setTouchBar(null);
}

let isTouchBarOn = false;

function toggleTouchBar() {
	isTouchBarOn = !isTouchBarOn;

	if (isTouchBarOn) {
		turnTouchBarOn();
	} else {
		turnTouchBarOff();
	}
}

// ipcMain.on('asynchronous-message', (event, ...args) => {
// 	console.log(...args);
// 	// When sending a message, the event name is the channel.
// 	// Send a synchronous reply by setting event.returnValue
// 	// Send an asynchronous reply by calling event.reply();
// 	// this helper method will automatically handle messages coming from
// 	// frames that aren't the main frame (e.g. iframes), whereas
// 	// event.sender.send(...) will always send to the main frame.
// 	event.reply('asynchronous-reply', 'pong');
// });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('ipc-ping', (event, ...args) => {
	console.log('Received ping. Sending pong...');
	event.reply('ipc-pong', 'IPC Pong!');
});

ipcMain.on('toggle-touchbar-visibility', (event, ...args) => {
	console.log('toggle-touchbar-visibility: event is', typeof event, event);
	console.log('toggle-touchbar-visibility: args is', typeof args, args);
	toggleTouchBar();
});

// ipcMain.on('get-config-json-message', async (event, ...args) => {
// 	console.log('get-config-json-message: event is', typeof event, event);
// 	console.log('get-config-json-message: args is', typeof args, args);

// 	const jsonFilePath = 'src/config.json';
// 	const jsonDataAsString = await fs.promises.readFile(jsonFilePath, {
// 		encoding: 'utf8'
// 	});
// 	const result = JSON.parse(jsonDataAsString);

// 	console.log(
// 		'on get-config-json-message: The reply will be:',
// 		typeof result,
// 		result
// 	);

// 	event.reply('get-config-json-reply', result);
// });

ipcMain.on('set-progress-bar-value-message', (event, ...args) => {
	let result = false;

	// console.log('set-progress-bar-value-message: arg is:', typeof args, args);

	if (args && args.length === 1) {
		const n = args[0];

		// If n < 0 then the progress bar will be removed.
		// If n > 1 then the progress bar will be switched to intermediate mode.

		if (n === parseFloat(n) && !Number.isNaN(n)) {
			win.setProgressBar(n);
			result = true;
		}
	}

	// console.log('set-progress-bar-value-message: The reply will be:', result);

	event.reply('set-progress-bar-value-reply', result);
});

// ipcMain.on('load-jpeg-image-message', async (event, ...args) => {
// 	let image;

// 	// console.log('set-progress-bar-value-message: arg is:', typeof args, args);

// 	if (args && args.length === 1) {
// 		// const n = args[0];

// 		// If n < 0 then the progress bar will be removed.
// 		// If n > 1 then the progress bar will be switched to intermediate mode.

// 		// if (n === parseFloat(n) && !Number.isNaN(n)) {
// 		// 	win.setProgressBar(n);
// 		// 	result = true;
// 		// }

// 		const filePath = args[0];
// 		const jpegData = await fs.promises.readFile(filePath);

// 		image = jpeg.decode(jpegData);

// 		// The returned value is Promise<{ width: number; height number; data: ? }>
// 	}

// 	// console.log('set-progress-bar-value-message: The reply will be:', result);

// 	event.reply('load-jpeg-image-reply', image);
// });

// On macOS: function createWindow (launchInfo) {
// function createWindow(launchInfo) {
function createWindow() {
	// launchInfo is defined only on macOS
	// console.log('launchInfo is', typeof launchInfo, launchInfo);

	// if (isPlatformLinux) {
	// 	console.log('isUnityRunning? :', app.isUnityRunning());
	// }

	const aboutPanelOptions = {
		applicationName,
		applicationVersion,
		copyright: `Copyright (c) 2018-${new Date().getUTCFullYear()} tom-weatherhead`,
		version: applicationVersion, // macOS only
		credits: 'Praise the LORD!', // macOS and Windows
		authors: ['tom-weatherhead'], // Linux only
		website: packageJson.homepage, // Linux only
		iconPath: defaultIconFilePath // Linux and Windows
		// On Linux, the icon will be shown as 64x64 pixels while retaining aspect ratio.
	};

	app.setAboutPanelOptions(aboutPanelOptions);

	let trayIconFilePath = '';

	switch (os.platform()) {
		case 'darwin':
			trayIconFilePath = macOsTrayIconFilePath;
			break;

		case 'linux':
			trayIconFilePath = linuxTrayIconFilePath;
			break;

		case 'win32':
			trayIconFilePath = windowsTrayIconFilePath;
			break;

		default:
			break;
	}
	const faviconFilePath = trayIconFilePath;
	// macOS: This icon appears briefly in the Menu Bar, not scaled.
	// -> Use a PNG that is less than 32x32.
	const tray = new Tray(trayIconFilePath);
	const primaryDisplayWorkArea = screen.getPrimaryDisplay().workArea;

	const browserWindowConfig = {
		backgroundColor: '#ffffff',
		// backgroundColor: '#7851a9', // From the TouchBar button
		// icon: 'assets/favicon.png',
		icon: faviconFilePath, // ThAW: Does this have any effect?
		title: applicationName,
		x: primaryDisplayWorkArea.x,
		y: primaryDisplayWorkArea.y,
		width: primaryDisplayWorkArea.width,
		height: primaryDisplayWorkArea.height,
		webPreferences: {
			allowRunningInsecureContent: false,
			// contextIsolation and worldSafeExecuteJavaScript:
			// See https://stackoverflow.com/questions/63427191/security-warning-in-the-console-of-browserwindow-electron-9-2-0
			// See also https://www.electronjs.org/docs/api/browser-window#class-browserwindow
			contextIsolation: false, // false if you want to run e2e tests with Spectron
			enableRemoteModule: true, // true if you want to run e2e tests with Spectron or use remote module in renderer context (ie. Angular)
			nodeIntegration: true // ,
			// preload: '/absolute/path/to/some/preload.js'
			// preload: `${__dirname}/preload.js`
			// worldSafeExecuteJavaScript: true
		}
	};

	// Create the browser window.
	win = new BrowserWindow(browserWindowConfig);

	// win.loadFile('dist/index.html');
	win.loadFile(`${__dirname}/dist/index.html`);

	// Event that fires when the window is closed.
	// win.on('closed', () => {
	// 	// win = null;
	// 	win = undefined;
	// });

	// win.on('resize', () => {
	// 	ipcMain.send('on-browser-window-resize', primaryDisplayWorkArea.x, primaryDisplayWorkArea.y, primaryDisplayWorkArea.width, primaryDisplayWorkArea.height);
	// });

	win.webContents.on('before-input-event', (event, input) => {
		// For example, only enable application menu keyboard shortcuts when Ctrl/Cmd are down:
		// win.webContents.setIgnoreMenuShortcuts(!input.control && !input.meta)

		if (input && input.code) {
			// console.log('Electron before-input-event: input.code is', input.code);

			switch (input.code) {
				case 'KeyA':
					app.showAboutPanel();
					event.preventDefault();
					break;

				case 'KeyB':
					if (isPlatformMac) {
						setTimeout(() => app.dock.bounce(), 5000);
					}

					event.preventDefault();
					break;

				case 'KeyC':
					if (isPlatformMac) {
						app.dock.setBadge('Foo');
					}

					event.preventDefault();
					break;

				case 'KeyD':
					if (isPlatformMac) {
						app.dock.setBadge('');
					}

					event.preventDefault();
					break;

				case 'KeyE':
					if (isPlatformMac) {
						turnTouchBarOn();
					}

					event.preventDefault();
					break;

				case 'KeyF':
					if (isPlatformMac) {
						turnTouchBarOff();
					}

					event.preventDefault();
					break;

				// app.dock.bounce(): number : Returns an integer ID representing the request.
				//   - Note that this method can only be used while the app is not focused; when the app is not focused it will return -1
				// app.dock.cancelBounce(id: number)
				// app.dock.downloadFinished(filePath: string)
				// app.dock.hide()
				// app.dock.show(): Promise<void> : Resolves when the dock icon is shown
				// app.dock.isVisible(): boolean
				// app.dock.setMenu(menu: Menu)
				// app.dock.getMenu(): Menu | null
				// app.dock.setIcon(image: NativeImage | string);

				case 'F5':
					win.webContents.reload();
					event.preventDefault();
					break;

				case 'F11':
					console.log('TODO: Full-screen mode');
					break;

				case 'F12':
					win.webContents.toggleDevTools();
					event.preventDefault();
					break;

				default:
					break;
			}
		}
	});

	// Uncomment the line below to open the DevTools.
	// win.webContents.openDevTools();

	// Configure the application's icon in the tray

	tray.on('click', () => {
		win.isVisible() ? win.hide() : win.show();
	});

	// win.webContents.on('did-finish-load', () => {
	// 	// The Electron main process sends an Electron IPC message to Angular:
	// 	win.webContents.send('ping2', 'Yee-haw, MoFo!');
	// });

	setDockMenu(); // macOS only
}

// Create the browser window upon Electron intialization:
app.on('ready', createWindow);

app.on('activate', () => {
	if (!win) {
		createWindow();
	}
});

// macOS: Terminate the app when all of the app's windows are closed.
app.on('window-all-closed', () => {
	// console.log('Event: window-all-closed');

	if (isPlatformMac || isPlatformLinux) {
		app.quit();
	}
});

// app.on('before-quit', () => {
// 	console.log('Event: before-quit');
// });

// app.on('will-quit', () => {
// 	console.log('Event: will-quit');
// });

// app.on('quit', () => {
// 	console.log('Event: quit');
// });

// app.on('activate', () => {
// 	console.log('Event: activate');
// });

// app.on('new-window-for-tab', () => {
// 	console.log('Event: new-window-for-tab');
// });

// app.on('browser-window-blur', () => {
// 	console.log('Event: browser-window-blur');
// });

// app.on('browser-window-focus', () => {
// 	console.log('Event: browser-window-focus');
// });

// app.on('browser-window-created', () => {
// 	console.log('Event: browser-window-created');
// });

// app.on('web-contents-created', () => {
// 	console.log('Event: web-contents-created');
// });

// app.on('gpu-info-update', () => {
// 	console.log('Event: gpu-info-update');
// });

// app.on('remote-require', () => {
// 	console.log('Event: remote-require');
// });

// app.on('session-created', () => {
// 	console.log('Event: session-created');
// });
