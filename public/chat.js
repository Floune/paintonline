document.addEventListener('DOMContentLoaded', () => new ChatBite)
window.socket = io()

class ChatBite {

  constructor() {
    this.listeners();
  }

  appendmsg(msg) {
    var node = document.createElement("p");
    var textnode = document.createTextNode(msg)
    node.appendChild(textnode)
    document.getElementById("messages").appendChild(node)
  }

  sendMsg() {
    socket.emit("message",document.getElementById("message").value)
    document.getElementById("message").value = ""
  }

  listeners() {
    document.getElementById('bouton').addEventListener("click", () => {
      this.sendMsg()
    })

    socket.on('message', (msg) => {
      this.appendmsg(msg)
    })
  }

}


