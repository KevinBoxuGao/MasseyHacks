import socketio

server_path = "https://covmapsbackend--cristianbicheru.repl.co"

socket_io = socketio.Client()
socket_io.connect(server_path)

@socket_io.on("echo")
def echo(data):
    print(data)
