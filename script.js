///////////////////
//// CONSTANTS ////
///////////////////

const width = 5;
const height = 5;

///////////////////
//// VARIABLES ////
///////////////////

var inputTextSize = document.getElementById('text-size');
var data;

///////////////////
//// FUNCTIONS ////
///////////////////

function createBingoBoard() {
	// Then pull in 15 common, and 9 uncommon ones, so everyone has a greater likelihood of winning.

	// Anything that has happened within the last 2 standups goes into the "common" pile

	var options = [];

	for(var i = 0; i < 19; i ++)
		options.push(takeRandomFromArray(data.commonOptions));
		
	for(var i = 0; i < 5; i ++)
		options.push(takeRandomFromArray(data.uncommonOptions));

	var container = document.getElementById('bingo-container');
	container.innerHTML = '';
	for(var h = 0; h < height; h ++) {
		var row = document.createElement('div');
		row.className = 'bingo-row';
		for(var w = 0; w < width; w ++) {
			var text;
			var image;
			
			// Set the text and image based on whether or not
			// this is the free space
			var isFreeSpace = (h == Math.floor(height / 2) && w == Math.floor(width / 2));
			
			if (isFreeSpace) {
				text = data.freespace;
				image = data.freespaceImage;
			} else {
				text = takeRandomFromArray(options);
				image = takeRandomFromArray(data.images);
			}

			var cell = createCell(text);
			cell.style.backgroundImage = 'url("images/' + image + '")';
			
			row.appendChild(cell);
		}
		container.appendChild(row);
	}
}

function createCell(text) {
	var cell = document.createElement('div');
	cell.classList.add('bingo-cell');
	cell.addEventListener('click', onCellClick)

	cell.innerHTML = '<p>' + text + '</p>';
	
	return cell;
}

function onCellClick(e) {
	e.target.classList.toggle('selected');
}

function takeRandomFromArray(array) {
	var index = Math.floor(Math.random() * array.length);
	var value = array.splice(index, 1);
	return value;
}

function onWindowResize(e) {
	var container = document.getElementById('bingo-container');
	var containerSizeOriginal = container.getBoundingClientRect();
	
	var containerWidth = containerSizeOriginal.width;
	var containerHeight = containerSizeOriginal.height;
	
	var containerSizeNew = containerWidth;
	if(containerWidth > containerHeight)
		containerSizeNew = containerHeight;
	
	console.log(containerWidth, containerHeight, containerSizeNew);
	
	// The width and height for each cell
	var cellSize = containerSizeNew / width;
	
	var cells = document.getElementsByClassName('bingo-cell');
	console.log('trying this', cells);
	var cellSizePx = cellSize + 'px';
	for(var i = 0; i < cells.length; i ++) {
		cells[i].style.width = cellSizePx;
		cells[i].style.height = cellSizePx;
		cells[i].style.fontSize = (cellSize / 10) + 'px';
	}
	
	var newContainerSize = cellSize * width;
	container.style.width = (newContainerSize + 'px');
	container.style.height = (newContainerSize + 'px');
	container.style.borderRadius = ((newContainerSize / 10) + 'px');
}

async function start() {
	data = await fetch('data.json').then(response => response.json());
	console.log(data);
	createBingoBoard();
	onWindowResize();
}

///////////////////
//// LISTENERS ////
///////////////////

window.addEventListener('resize', onWindowResize);

///////////////////
////// START //////
///////////////////

start();