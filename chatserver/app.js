const WebSocketServer = require("ws").Server;
 
let wss = new WebSocketServer({port: 3000});
 console.log("Server is Running on port 3000 ...");
 
wss.on('connection', (ws) => {
    var clientIp = ws._socket.address().address;
    console.log('connected: ' + clientIp); // Logging clientIp
    ws.on('message', wss.broadcast);

    ws.send( // Hello message
        JSON.stringify({
            t: 'm',
            u: 'Server',
            m: 'Hi. You are connected to the server.'
        }));

});

wss.broadcast = msg => {
    console.log(msg);
    wss.clients.forEach((client)=> {
        client.send(msg);
    });
};