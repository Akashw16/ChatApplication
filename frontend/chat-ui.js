class ChatUI {
    constructor() {
        this.socket = null;
        this.username = '';
        this.currentRoom = 'Global';
        this.initializeUI();
    }

    initializeUI() {
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('createRoomBtn').addEventListener('click', () => this.createRoom());
        
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    handleLogin() {
        const username = document.getElementById('usernameInput').value.trim();
        if (username) {
            this.username = username;
            this.connectWebSocket();
        } else {
            alert('Please enter a username');
        }
    }

    connectWebSocket() {
        this.socket = new WebSocket('ws://localhost:8080');
        
        this.socket.onopen = () => {
            console.log('WebSocket Connected');
            this.socket.send(JSON.stringify({
                type: 'authenticate',
                username: this.username
            }));
        };
    
        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleServerMessage(data);
        };
    }

    handleServerMessage(data) {
        switch(data.type) {
            case 'authenticated':
                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('chatSection').classList.remove('hidden');
                this.updateRoomList(data.rooms);
                this.updateUserCount(data.userCount);
                break;
            case 'message':
                this.displayMessage(data);
                break;
            case 'roomList':
                this.updateRoomList(data.rooms);
                break;
            case 'userCount':
                this.updateUserCount(data.count);
                break;
            case 'roomJoined':
                this.handleRoomJoin(data.room);
                break;
        }
    }

    displayMessage(data) {
        const container = document.getElementById('messageContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <strong>${data.username}</strong>
            <span>${data.content}</span>
            <small>${new Date().toLocaleTimeString()}</small>
        `;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        if (message && this.socket) {
            this.socket.send(JSON.stringify({
                type: 'message',
                content: message,
                room: this.currentRoom
            }));
            input.value = '';
        }
    }

    createRoom() {
        const input = document.getElementById('newRoomInput');
        const roomName = input.value.trim();
        if (roomName && this.socket) {
            this.socket.send(JSON.stringify({
                type: 'createRoom',
                roomName: roomName
            }));
            input.value = '';
        }
    }

    updateRoomList(rooms) {
        const container = document.getElementById('roomList');
        container.innerHTML = '';
        rooms.forEach(room => {
            const div = document.createElement('div');
            div.className = 'room-item';
            div.textContent = room;
            div.onclick = () => this.joinRoom(room);
            container.appendChild(div);
        });
    }

    joinRoom(roomName) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                type: 'joinRoom',
                roomName: roomName
            }));
        }
    }

    handleRoomJoin(roomName) {
        this.currentRoom = roomName;
        document.getElementById('currentRoom').textContent = roomName;
        document.getElementById('messageContainer').innerHTML = '';
    }

    updateUserCount(count) {
        document.getElementById('userCount').textContent = `Users: ${count}`;
    }
}

new ChatUI();