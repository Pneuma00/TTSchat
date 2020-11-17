const nickname = prompt('닉네임을 입력하세요.')
const channel = prompt('접속할 채널을 입력하세요.')

const socket = io()

socket.emit('joinChannel', channel, { nickname: nickname })

document.querySelector('#send').addEventListener('click', () => {
    socket.emit('msgSend', { user: nickname, channel: channel, content: document.querySelector('#msg').value })
    document.querySelector('#msg').value = ''
})

socket.on('msgReceive', msg => {
    document.querySelector('#chat').value += `${msg.user} : ${msg.content}\n`
})

socket.on('userJoinedChannel', user => {
    document.querySelector('#chat').value += `${user.nickname} joined.\n`
})