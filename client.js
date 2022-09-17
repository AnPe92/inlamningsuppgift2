

const net = require('net');

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let portA;


const waitForUsername = new Promise(resolve => {
    readLine.question('Ange ett användarnamn: ', username => {
        readLine.question('Ange port som du vill connecta till: ', port => {
            portA = port;
            resolve(username)
        });
    })
});


waitForUsername.then((username) => {
    const socket = net.connect({
        port: portA
    });


    socket.on('connect', () => {
        socket.write(`${username} har hoppat in i chatten.`);
    });

    readLine.on('line', data => {
        if (data === 'lämna') {
            socket.write(`${username} har lämnat chatten.`);
            socket.setTimeout(500);
        } else {
            socket.write(`${username}: ${data}`);
        }
    });

    socket.on('data', data => {
        console.log('\x1b[34m%s\x1b[0m', data);
    });

    socket.on('timeout', () => {
        socket.write('leave');
        socket.setTimeout(777)
        socket.end();
    });

    socket.on('close', () => {
        socket.end();
    })

    socket.on('end', () => {
        process.exit();
    });

    socket.on('error', () => {
        console.log('Server has been shut down.');
    });

});

