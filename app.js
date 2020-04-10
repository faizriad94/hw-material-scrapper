const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const { dialog, app } = require('electron').remote;
const getPixels = require('get-pixels');

// Doms
const savePath = document.querySelector('.savePath');
const url = document.querySelector('.url');
const run = document.querySelector('.run');
const loader = document.querySelector('.lds');

// const readDir = 'C:/Users/KAF2/OneDrive - HAWORTH INC/Documents/My Pictures/New folder/'
const readDir = savePath + '/';
const writeDir =
	'C:/Users/KAF2/OneDrive - HAWORTH INC/Documents/My Pictures/New folder/materialInfo.txt';
// const writeDir = `${savePath}/materialInfo.txt`

//flag to check if file explorer is open
let isOpen = false;

// Event: Open dialog box for save path
document.getElementById('saveButton').addEventListener('click', () => {
	// opens file explorer
	let filePath = dialog.showOpenDialog({
		properties: ['openDirectory'],
	});

	// Get selected file path and display in input
	filePath.then((file) => {
		savePath.value = file.filePaths;
	});
});

// Event: Run script
run.addEventListener('click', () => {
	let sourceURL = url.value;

	// base url
	let hwLink = 'https://surfaces.haworth.com';

	if (!sourceURL) {
		alert('Please enter URL from surface.haworth.com');
	} else {
		// turn on loading animation
		loader.className = 'lds-ring';

		// traverse the dom, get url of JPG files
		request(sourceURL, (error, response, html) => {
			if (!error && response.statusCode == 200) {
				const $ = cheerio.load(html);
				const jpgs = $('.color-link');

				jpgs.each((i, el) => {
					const jpgSource = $(el)
						.children('img')
						.attr('src')
						.replace('sm', 'lg');

					const finishCode = $(el).attr('data-finish-code');
					let fullUrl = hwLink + jpgSource;

					download(fullUrl, finishCode + '.jpg', savePath.value, () => {});
				});

				// turn off loading animation
				loader.className = ' ';
				openFileExplorer(savePath.value);
			}
		});
	}

	createMaterials(readDir, writeDir, 'fabric');
});

// opens file explorer using command prompt
const openFileExplorer = function (path) {
	let open = require('child_process');
	let cmdURL = `start explorer ${path}`;
	if (!isOpen) {
		isOpen = true;
		open.exec(cmdURL, 'utf8', (err, stdout, stderr) => {
			if (err) {
				return console.log(err);
			}
		});
	}
};

//download jpg
const download = function (uri, filename, savePath, callback) {
	request.head(uri, function (err, res, body) {
		request(uri)
			.pipe(fs.createWriteStream(`${savePath}/` + filename))
			.on(callback);
	});
};

//Write jpg data to a text file
function createMaterials(readPath, writePath, materialType) {
	let files = fs.readdirSync(readPath);
	// fs.writeFile(writePath, data, () => { if (err) throw err})
	files.map((file) => {
		getPixels(readDir + file, (err, px) => {
			if (err) {
				console.log(err);
				return;
			}

			let r = px.data[0];
			let g = px.data[1];
			let b = px.data[2];

			let fileName = file.split('.').slice(0, 1).toString();
			let amount = 1;

			let data = `,${fileName} ${r}\t${g}\t${b}\t${materialType}\t${amount}\t${file}\n`;

			fs.appendFileSync(writePath, data);
		});
	});
}
