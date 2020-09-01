document.addEventListener('DOMContentLoaded', () => new ChatBite)
window.socket = io()

class ChatBite {

  constructor() {
    this.listeners();
  }

  appendmsg(msg) {
    var node = document.createElement("div");
    node.classList.add("msg")
    var pe = document.createElement("p");
    var textnode = document.createTextNode(msg)
    pe.appendChild(textnode)
    node.appendChild(pe)
    document.getElementById("messages").appendChild(node)
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
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


