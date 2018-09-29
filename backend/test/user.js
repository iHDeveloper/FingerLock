const socketio = require('socket.io-client')
var io = socketio('http://localhost:2030')

io.on('connect', () => {
    console.log("Connected!")

    console.
})