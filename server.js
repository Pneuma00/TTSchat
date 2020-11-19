const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    const user = {
        id: socket.id,
        nickname: ''
    }

    console.log('A user connected')

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })

    socket.on('join', nickname => {
        if (typeof nickname !== 'string') return
        user.nickname = nickname

        socket.join('chat')
        io.to('chat').emit('userJoined', nickname)
    })

    socket.on('msgSend', content => {
        if (typeof content !== 'string') return
        
        console.log(`${user.nickname} : ${content}`)
        io.to('chat').emit('msgReceive', content, user.nickname)
    })
})

http.listen(process.env.PORT || 3000)