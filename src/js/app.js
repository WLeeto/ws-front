const ws = new WebSocket('ws://localhost:7070/ws')

const chat = document.querySelector('.chat')
const chatMessage = document.querySelector('.chat-message')
const chatSend = document.querySelector('.chat-send')
const usersDiv = document.querySelector('.users')
const newNameText = document.getElementById('startNameInput')
const newNameOkBtn = document.querySelector('.enter-name-ok')
const newUserModal = document.querySelector('.start-modal')

import { api } from './apiCRUD'

let currentUserNickname = null

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

chat.addEventListener('DOMNodeInserted', event => {
  scrollToBottom();  
});

function getCurrentDateTimeStr() {
  const DT = new Date()
  return `${DT.getHours()}:${DT.getMinutes()} ${DT.getDate()}.${DT.getMonth() + 1}.${DT.getFullYear()}`
}

chatSend.addEventListener('click', (e) => {
  e.preventDefault()
  const msg = chatMessage.value
  if (!msg) return

  const fullMessage = {
    text: msg, 
    from: currentUserNickname,
    dateTime: getCurrentDateTimeStr()
  }

  ws.send(JSON.stringify({message: fullMessage}))
  chatMessage.value = ''
})

newNameOkBtn.addEventListener('click', (e) => {

  // todo: Проверка ника

  currentUserNickname = newNameText.value
  ws.send(JSON.stringify({user: currentUserNickname}))
  newUserModal.style.display = 'none'
})

ws.addEventListener('close', (e) => {
  ws.send(JSON.stringify({quit:currentUserNickname}))
  console.log(e)
  console.log('ws close')
})

ws.addEventListener('open', (e) => {
    newUserModal.style.display = 'block'

    console.log(e)
    console.log('ws open')
})

ws.addEventListener('error', (e) => {
    console.log(e)
    console.log('ws error')
})

ws.addEventListener('message', (e) => {
    console.log(e)
    console.log('ws message')

    const data = JSON.parse(e.data)

    if (data.chat) {
      const { chat: messages } = data

      messages.forEach(message => {
      const chatMessage = document.createElement('div')
      if(message.from == currentUserNickname) {
        chatMessage.classList.add('message-from-me')
      }
      chat.appendChild(chatMessage)
      
      const info = document.createElement('p')
      info.textContent = `${message.from} ${message.dateTime}`
      info.classList.add('message-info')
      chatMessage.appendChild(info)

      const text = document.createElement('p')
      text.textContent = message.text
      text.classList.add('message-text')
      chatMessage.appendChild(text)
    })
    }
    

    if (data.user) {
      let names = null
      const users = { user: names } = data

      names.forEach(name => {
      const user = document.createElement('div')
      user.classList.add('users-item')
      user.textContent = '😀' + name
      usersDiv.appendChild(user)
    })
    }
})


