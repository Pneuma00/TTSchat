const nickname = prompt('닉네임을 입력하세요.')
const channel = prompt('접속할 채널을 입력하세요.')

const socket = io()

socket.emit('joinChannel', channel, { nickname: nickname })

const sendMsg = () => {
    socket.emit('msgSend', { user: nickname, channel: channel, content: document.querySelector('#msg').value })
    document.querySelector('#msg').value = ''
}

document.querySelector('#send').addEventListener('click', sendMsg)
document.querySelector('#msg').addEventListener('keydown', evt => {
    if (evt.keyCode === 13) sendMsg()
})

socket.on('msgReceive', msg => {
    console.log(`${msg.user} : ${msg.content}`)
    document.querySelector('#chat').value += `${msg.user} : ${msg.content}\n`
})

socket.on('userJoinedChannel', user => {
    console.log(`${user.nickname} joined`)
    document.querySelector('#chat').value += `${user.nickname} joined.\n`
})