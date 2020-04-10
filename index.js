const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
	// Create the browser window.
	let win = new BrowserWindow({
		width: 500,
		height: 600,
		icon: './logo.png',
		// resizable: false,
		backgroundColor: '#353D4D',
		webPreferences: {
			nodeIntegration: true,
		},
	});
	// and load the index.html of the app.
	win.loadFile('index.html');

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(template);
	// Insert men
	Menu.setApplicationMenu(mainMenu);
}
// app.on('ready', createWindow);
app.whenReady().then(createWindow);
// Create menu template
const template = [
	{
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
		],
	},
	// { role: 'viewMenu' }
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ role: 'toggledevtools' },
			{ type: 'separator' },
			{ role: 'resetzoom' },
			{ role: 'zoomin' },
			{ role: 'zoomout' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' },
		],
	},
	// {
	// 	label: 'Support',
	// 	submenu: [
	// 		{
	// 			label:
	// 				'For suggestions/ideas/bug reports, please email ahmad.faiz@haworth.com'
	// 		}
	// 	]
	// }
];
