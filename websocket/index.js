const { Server } = require('ws');

const server = new Server({ port: 3001 });

server.on('connection', client => {
    console.log('Client connected');
    client.on('message', data => {
        try {
            const obj = JSON.parse(data);
            if (obj.type === 'name') {
                client.name = obj.data;
                return;
            }
            if (obj.type === 'start-game') {
                if (server.isPlaying) {
                    client.send(JSON.stringify({
                        name: 'The Server',
                        message: 'A game is going on already!'
                    }));
                    return;
                }
                server.number = Math.round(Math.random() * 10);
                server.isPlaying = true;
                for (const c of server.clients) {
                    c.send(JSON.stringify({
                        name: 'The Server',
                        message: 'Guess my number!'
                    }));
                }
                return;
            }
            for (const c of server.clients) {
                if (c !== client) {
                    c.send(JSON.stringify({
                        name: client.name,
                        message: obj.data
                    }));
                }
            }
            client.send(JSON.stringify({
                name: 'You',
                message: obj.data
            }));

            if (parseInt(obj.data) === server.number && server.isPlaying) {
                for (const c of server.clients) {
                    if (c !== client) {
                        c.send(JSON.stringify({
                            name: 'The Server',
                            message: `${client.name} wins!`
                        }));
                    }
                }
                client.send(JSON.stringify({
                    name: 'The Server',
                    message: 'You win!'
                }));
                server.isPlaying = false;
                return;
            } else {
                for (const c of server.clients) {
                    c.send(JSON.stringify({
                        name: 'The Server',
                        message: `${server.isPlaying ? 'Wrong, keep trying!' : 'Press Start Game'}`
                    }));
                }
            }
        } catch (error) {
            client.send(JSON.stringify({ error }))
        }
    })
});