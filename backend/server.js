const WebSocket = require('ws');
const http = require('http');
const UserManager = require('./user-management');

class ChatServer {
    constructor() {
        this.server = http.createServer();
        this.wss = new WebSocket.Server({ server: this.server });
        this.rooms = new Set(['Global']);
        this.userManager = new UserManager();
        this.clients = new Map();
        this.messages = new Map();
        
        this.initializeWebSocketServer();
    }

    initializeWebSocketServer() {
        this.wss.on('connection', (ws) => {
            console.log('New client connected');
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('Message parsing error:', error);
                }
            });

            ws.on('close', () => {
                this.handleDisconnect(ws);
            });
        });

        this.server.listen(8080, () => {
            console.log('Server running on port 8080');
        });
    }

    handleMessage(ws, data) {
        switch(data.type) {
            case 'authenticate':
                this.authenticateUser(ws, data);
                break;
            case 'message':
                this.broadcastMessage(ws, data);
                break;
            case 'createRoom':
                this.createRoom(data.roomName);
                break;
            case 'joinRoom':
                this.joinRoom(ws, data);
                break;
        }
    }

    authenticateUser(ws, data) {
        const username = data.username;
        if (this.userManager.isUsernameTaken(username)) {
            ws.send(JSON.stringify({
                type: 'error',
                content: 'Username already taken'
            }));
            return;
        }

        this.userManager.addUser(username);
        this.clients.set(ws, { username, room: 'Global' });
        
        ws.send(JSON.stringify({
            type: 'authenticated',
            rooms: Array.from(this.rooms),
            userCount: this.clients.size
        }));

        this.broadcastUserCount();
    }

    broadcastMessage(ws, data) {
        const sender = this.clients.get(ws);
        if (!sender) return;

        const messageData = {
            type: 'message',
            content: data.content,
            username: sender.username,
            timestamp: new Date().toISOString(),
            room: sender.room
        };

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                const clientData = this.clients.get(client);
                if (clientData && clientData.room === sender.room) {
                    client.send(JSON.stringify(messageData));
                }
            }
        });
    }

    createRoom(roomName) {
        if (!this.rooms.has(roomName)) {
            this.rooms.add(roomName);
            this.broadcastRoomList();
        }
    }

    joinRoom(ws, data) {
        const clientData = this.clients.get(ws);
        if (clientData) {
            const oldRoom = clientData.room;
            clientData.room = data.roomName;
            
            ws.send(JSON.stringify({
                type: 'roomJoined',
                room: data.roomName
            }));

            this.broadcastToRoom(oldRoom, {
                type: 'systemMessage',
                content: `${clientData.username} left the room`
            });

            this.broadcastToRoom(data.roomName, {
                type: 'systemMessage',
                content: `${clientData.username} joined the room`
            });
        }
    }

    broadcastToRoom(roomName, message) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                const clientData = this.clients.get(client);
                if (clientData && clientData.room === roomName) {
                    client.send(JSON.stringify(message));
                }
            }
        });
    }

    handleDisconnect(ws) {
        const clientData = this.clients.get(ws);
        if (clientData) {
            this.userManager.removeUser(clientData.username);
            this.clients.delete(ws);
            this.broadcastUserCount();
            
            this.broadcastToRoom(clientData.room, {
                type: 'systemMessage',
                content: `${clientData.username} disconnected`
            });
        }
    }

    broadcastUserCount() {
        const count = this.clients.size;
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'userCount',
                    count: count
                }));
            }
        });
    }

    broadcastRoomList() {
        const roomList = Array.from(this.rooms);
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'roomList',
                    rooms: roomList
                }));
            }
        });
    }
}

new ChatServer();