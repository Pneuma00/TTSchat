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

    socket.on('joinChannel', (channel, user) => {
        socket.join(channel)
        console.log(`${user.nickname} joined ${channel} channel.`)
        io.in(channel).emit('userJoinedChannel', { nickname: user.nickname })
    })

    socket.on('msgSend', msg => {
        console.log(`${msg.user} : ${msg.content}`)
        io.in(msg.channel).emit('msgReceive', { content: msg.content, user: msg.user })
    })
})

http.listen(process.env.PORT || 3000)