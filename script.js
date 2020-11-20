const socket = io()

const synthesis = window.speechSynthesis
const utterance = new SpeechSynthesisUtterance()

let voices
(() => {
    return new Promise((resolve, reject) => {
        const check = setInterval(() => {
            if (synthesis.getVoices().length !== 0) {
                resolve(synthesis.getVoices());
                clearInterval(check);
                console.log('loaded voices')
            }
        }, 10);
    })
})().then(voices => {
    utterance.pitch = 1
    utterance.rate = 1
    utterance.voice = voices.find(v => v.name === 'Google 한국의')
})


socket.emit('join', prompt('닉네임을 입력하세요.'))

const sendMsg = () => {
    socket.emit('msgSend', document.querySelector('#msg').value)
    document.querySelector('#msg').value = ''
}

document.querySelector('#send').addEventListener('click', sendMsg)
document.querySelector('#msg').addEventListener('keydown', evt => {
    if (evt.keyCode === 13) sendMsg()
})

socket.on('msgReceive', (content, nickname) => {
    console.log(`${nickname} : ${content}`)
    document.querySelector('#chat').value += `${nickname} : ${content}\n`

    utterance.text = content
    synthesis.speak(utterance)
})

socket.on('userJoined', nickname => {
    console.log(nickname + ' joined')
    document.querySelector('#chat').value += nickname + ' joined.\n'
})

socket.on('userLeft', nickname => {
    console.log(nickname + ' left')
    document.querySelector('#chat').value += nickname + ' left.\n'
})