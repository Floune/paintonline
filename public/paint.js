let isDrawing = false;
let x = 0;
let y = 0;
const paint = document.getElementById('canvas');
const context = canvas.getContext('2d');
let color = "";
erase();

socket.on('drawing', function(data){
	drawLine(context, data.x, data.y, data.x1, data.y1, data.color)
})

document.getElementById("erase").addEventListener("click", e => {
	erase()
})

document.getElementById("black").addEventListener("click", e => {
	color = "black";
})

document.getElementById("yellow").addEventListener("click", e => {
	color = "yellow";
})

document.getElementById("blue").addEventListener("click", e => {
	color = "blue";
})

document.getElementById("red").addEventListener("click", e => {
	color = "red";
})

document.getElementById("green").addEventListener("click", e => {
	color = "green";
})

document.getElementById("pink").addEventListener("click", e => {
	color = "pink";
})

paint.addEventListener('mousedown', e => {
	const rect = paint.getBoundingClientRect();
	x = e.clientX - rect.left;
	y = e.clientY - rect.top;
	isDrawing = true;
});

paint.addEventListener('mousemove', e => {
	if (isDrawing === true) {
		drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top, color);
		socket.emit("drawing", {
			x: x, 
			y: y,
			x1: e.clientX - rect.left,
			y1: e.clientY - rect.top,
			color: color,
		})
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
	}
});

window.addEventListener('mouseup', e => {
	if (isDrawing === true) {
		drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
		x = 0;
		y = 0;
		isDrawing = false;
	}
});

function drawLine(context, x1, y1, x2, y2, dColor) {
	context.beginPath();
	context.strokeStyle = dColor;
	context.lineWidth = 1;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.closePath();
}

function erase(ctx) {
	context.clearRect(0, 0, paint.width, paint.height);
	context.fillStyle = "white";
	context.fillRect(0, 0, paint.width, paint.height);
}