# Real-Time Chat Application

A web-based chat application that enables real-time communication between users through chat rooms.

## Features

- User authentication with unique usernames
- Real-time messaging using WebSocket
- Multiple chat rooms support
- Create and join different chat rooms
- User count tracking
- Responsive design for all devices
- Message history within rooms
- System notifications for user events

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
- Backend:
  - Node.js
  - WebSocket (ws library)

## Project Structure

```
chat-application/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── chat-ui.js
├── backend/
│   ├── server.js
│   └── user-management.js
└── package.json
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chat-application
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open `frontend/index.html` in your web browser

## Usage

1. Enter a username to join the chat
2. Create new chat rooms using the input field in the rooms panel
3. Click on room names to switch between chat rooms
4. Type messages in the input field and press Enter or click Send
5. View active user count in the chat header

## Technical Requirements

- Node.js v14 or higher
- Modern web browser with WebSocket support
- Port 8080 available for WebSocket server

## Development

To run the application in development mode:

1. Start the WebSocket server:

```bash
node backend/server.js
```

2. Open `frontend/index.html` in your browser

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Known Issues

- Messages are not persisted after server restart
- No user authentication beyond username uniqueness
- Room list resets on server restart

## Future Enhancements

- Message persistence using a database
- User authentication with passwords
- File sharing capabilities
- Private messaging between users
- Message formatting (bold, italic, etc.)
- Emoji support
- User typing indicators
- Online/offline status
- Message read receipts

## License

This project is licensed under the MIT License

## Author

[Akash]

## Acknowledgments

- WebSocket protocol
- Node.js community
- Various open-source contributors

## Support

For support, email [akashwani.sit.comp@gmail.com]
