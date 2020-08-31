document.addEventListener('DOMContentLoaded', () => new PainterBite)


class PainterBite {
	
	constructor() {
		this.isDrawing = false;
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


	drawLine(x1, y1, x2, y2, color) {
		console.log(x1)
		console.log(y1)
		console.log(x2)
		console.log(y2)

		this.context.beginPath();
		this.context.strokeStyle = color;
		this.context.lineWidth = 1;
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
		this.context.closePath();
	}

	erase() {
		this.context.clearRect(0, 0, this.paint.width, this.paint.height);
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.paint.width, this.paint.height);
	}

	setColor(e)  {
		this.color = e.getAttribute("data-color")
	}

	listeners() {

		window.socket.on('drawing', (data) => {
			this.drawLine(data.x, data.y, data.x1, data.y1, data.color)
		})

		const actions = [...document.querySelectorAll("[data-action]")]

		actions.forEach(elem => {
			elem.addEventListener("click", e => {
				const action = e.currentTarget.getAttribute("data-action")
				if (typeof this[action] === "function") {
					this[action](e.currentTarget)
				}
			})
		})

		this.paint.addEventListener('mousedown', e => {
			this.rect = this.paint.getBoundingClientRect();
			this.x = e.clientX - this.rect.left;
			this.y = e.clientY - this.rect.top;
			this.isDrawing = true;
		});

		this.paint.addEventListener('mousemove', e => {
			if (this.isDrawing) {
				this.drawLine(this.x, this.y, e.clientX - this.rect.left, e.clientY - this.rect.top, this.color);
				socket.emit("drawing", {
					x: this.x, 
					y: this.y,
					x1: e.clientX - this.rect.left,
					y1: e.clientY - this.rect.top,
					color: this.color,
				})
				this.x = e.clientX - this.rect.left;
				this.y = e.clientY - this.rect.top;
			}
		});

		this.paint.addEventListener('mouseup', e => {
			if (this.isDrawing) {
				this.drawLine(e.clientX - this.rect.left, e.clientY - this.rect.top, this.color);
				this.x = 0;
				this.y = 0;
				this.isDrawing = false;
			}
			localStorage.setItem("paint", this.paint.toDataURL());
		});

		document.querySelector("form").addEventListener("submit", function(e) {
			e.preventDefault();
		})
	}

}