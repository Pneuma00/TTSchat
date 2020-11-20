const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    const id = socket.id
    const ip = socket.handshake.address.address
    let username = ''
    let rateGauge = 0

    const rateDecreaser = setInterval(() => {
        if (rateGauge > 0) rateGauge -= 1
    }, 100)

    console.log(`A user connected (ID: ${id}, IP: ${ip})`)

    socket.on('disconnect', () => {
        console.log(`User disconnected (ID: ${id}, IP: ${ip})`)

        io.to('chat').emit('userLeft', username)
        clearInterval(rateDecreaser)
    })

    socket.on('join', nickname => {
        if (username !== '') return
        if (typeof nickname !== 'string') return
        username = nickname

        socket.join('chat')
        io.to('chat').emit('userJoined', username)
    })

    socket.on('msgSend', content => {
        if (rateGauge > 100) return
        if (typeof content !== 'string') return
        if (content === '') return

        rateGauge += 25

        console.log(`${username} : ${content}`)
        io.to('chat').emit('msgReceive', content, username)
    })
})

http.listen(process.env.PORT || 3000)