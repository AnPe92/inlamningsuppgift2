
const net = require('net');

let sockets = [];


const server = net.createServer(socket => {

    sockets.push(socket)
    console.log('En användare har joinat chatten');

    socket.on('data', data => {
        broadcast(data, socket);
    });

    socket.on('error', err => {
        console.log('En användare har disconnectat från servern.');
    });

    socket.on('close', data => {
        console.log('En användare har lämnat chatten');
    });
});

server.listen(8080, 'localhost', 200, () => {
    console.log('Server är öppnad på port: ', server.address().port)
});


function broadcast(message, socketSent) {

    if (message.toString() === 'leave') {
        const index = sockets.indexOf(socketSent);
        sockets.splice(index, 1);
    } else {
        sockets.forEach(socket => {
            if (socket !== socketSent) socket.write(message)
        })
    }
}