const socket = io()

document.querySelector('#send').addEventListener('click', () => {
    socket.emit('msgSend', { content: document.querySelector('#msg').value })
    document.querySelector('#msg').value = ''
})

socket.on('msgReceive', data => {
    document.querySelector('#chat').value += data.content + '\n'
})