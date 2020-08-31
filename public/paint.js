document.addEventListener('DOMContentLoaded', () => new PainterBite)


class PainterBite {
	
	constructor() {
		this.isDrawing = false;
		this.lineWidth = document.querySelector("#line-width").value;
		this.x = 0;
		this.y = 0;
		this.paint = document.getElementById('canvas');
		this.context = this.paint.getContext('2d');
		this.color = "";
		this.rect = this.paint.getBoundingClientRect();
		this.erase();
		this.listeners();
		this.drawLine = this.drawLine.bind(this)
	}


	drawLine(drawInfos) {
		this.context.beginPath();
		this.context.strokeStyle = drawInfos.color;
		this.context.lineWidth = drawInfos.width;
		this.context.moveTo(drawInfos.x1, drawInfos.y1);
		this.context.lineTo(drawInfos.x2, drawInfos.y2);
		this.context.stroke();
		this.context.closePath();
	}

	erase() {
		this.context.clearRect(0, 0, this.paint.width, this.paint.height);
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.paint.width, this.paint.height);
	}

	globalErase() {
		window.socket.emit("g-erase")
	}

	setColor(e)  {
		this.color = e.getAttribute("data-color")
	}

	stopDrawing(e) {
		if (this.isDrawing) {
			this.x = 0;
			this.y = 0;
			this.isDrawing = false;
		}
	}

	saveDrawing() {
		localStorage.setItem("paint", this.paint.toDataURL());
	}

	loadDrawing() {
		let src = localStorage.getItem("paint");
		let img = document.createElement('img');
		img.src = src;
		this.erase;
		this.context.drawImage(img, 0, 0)
	}

	handleMove(e) {
		if (this.isDrawing) {
			this.drawLine({
				x1: this.x,
				y1: this.y,
				x2: e.clientX - this.rect.left,
				x2: e.clientY - this.rect.top,
				color: this.color,
				width: this.lineWidth,
			});
			socket.emit("drawing", {
				x1: this.x, 
				y1: this.y,
				x2: e.clientX - this.rect.left,
				y2: e.clientY - this.rect.top,
				color: this.color,
				lineWidth: this.lineWidth,
			})
			this.x = e.clientX - this.rect.left;
			this.y = e.clientY - this.rect.top;
		}
	}

	bindClickButtons(e) {
		const action = e.currentTarget.getAttribute("data-action")
		if (typeof this[action] === "function") {
			this[action](e.currentTarget)
		}
	}

	listeners() {

		window.socket.on('drawing', (data) => {
			this.drawLine({
				x1: data.x1,
				y1: data.y1, 
				x2: data.x2, 
				y2: data.y2, 
				color: data.color,
				width: data.lineWidth,
			})
		})

		window.socket.on('g-erase', () => {
			this.erase();
		})

		const actions = [...document.querySelectorAll("[data-action]")]

		actions.forEach(elem => {
			elem.addEventListener("click", e => {
				this.bindClickButtons(e)
			})
		})

		this.paint.addEventListener('mousedown', e => {
			this.x = e.clientX - this.rect.left;
			this.y = e.clientY - this.rect.top;
			this.isDrawing = true;
		});

		this.paint.addEventListener('mousemove', e => {
			this.handleMove(e)
		});

		this.paint.addEventListener('mouseup', e => {
			this.handleMove(e)
			this.stopDrawing(e)
		});

		document.querySelector("form").addEventListener("submit", function(e) {
			e.preventDefault();
		})

		document.querySelector("#line-width").addEventListener("mouseup", (e) => {
			this.lineWidth = e.currentTarget.value;
		})
	}

}