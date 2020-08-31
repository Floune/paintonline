const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/index.html'));
})

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('message', (msg) => {
		io.emit('message', msg)
	});

	socket.on("drawing", (data) => {
		io.emit('drawing', data)
	})

	socket.on("g-erase", () => {
		io.emit('g-erase')
	})
});

http.listen(port, () => {
	console.log('listening on *:3000');
});