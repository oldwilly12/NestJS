import { Manager } from 'socket.io-client'

export const connectToServer = () => {
    //http://localhost:3001/socket.io/socket.io.js
    // npm install socket.io-client

    const manager = new Manager('http://localhost:3001/socket.io/socket.io.js');

    const socket = manager.socket('/');
    console.log({socket});

    
}