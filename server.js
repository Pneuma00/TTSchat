const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    console.log('A user connected')

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })

    socket.on('msgSend', data => {
        console.log(data.content)
        socket.emit('msgReceive', { content: data.content })
    })
})

http.listen(3000, () => {
    console.log('listening on *:3000');
})