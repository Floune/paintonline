let socket = io()

document.getElementById('bouton').addEventListener("click", function() {
  sendMsg()
})

document.getElementById('message').addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
      sendMsg()
    }
});

socket.on('message', function(msg){
  appendmsg(msg)
})

function appendmsg(msg) {
  var node = document.createElement("li");
  var textnode = document.createTextNode(msg)
  node.appendChild(textnode)
  document.getElementById("messages").appendChild(node)
}

function sendMsg() {
  socket.emit("message", document.getElementById("message").value)
  document.getElementById("message").value = ""
}