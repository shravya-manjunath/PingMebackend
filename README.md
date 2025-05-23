# PingMe

PingMe is a real-time chat application built with Node.js, Express, Socket.IO, and MongoDB. It allows users to sign up, log in, create rooms, join rooms, and send messages.

## Live Demo
   [PingMe frontend repository](https://github.com/pranavgadham/PingMe.git)  


## Features

- User authentication (sign up and log in)
- Create and join chat rooms
- Real-time messaging
- Room management (add/remove users, list rooms)
- Message history


## Installation

1. Clone the repository:
   
   ```sh
   git clone https://github.com/yourusername/charterapp.git
   cd charterapp
   ```
2. Install dependencies:
   
   ```sh
   npm install
   ```
3. Create a .env file in the root directory and add the following environment variables:
   
    ```sh
    PORT=your_port_number
    mongoURL=your_mongodb_connection_string
    ```
4. Start the development server:
   
     ```sh
     npm run dev
     ```

## Usage

- The server will start on the port specified in the .env file. 
- Use a Socket.IO client to connect to the server and interact with the available events.

## API Endpoints

User Events

- verify: Verify user credentials.
- signup: Create a new user.
- getUserById: Get user details by ID.
  
Room Events

- croom: Create a new room.
- room: Get a list of all rooms.
- join: Join a room.
- leaveRoom: Leave a room.
  
Message Events
- getMessages: Get previous messages of a room.
- sendMessage: Send a message to a room.

## Author

### SHRAVYA M
