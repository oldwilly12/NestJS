import { Manager, Socket } from 'socket.io-client'

let socket: Socket;

export const connectToServer = ( token: string ) => {
    //http://localhost:3001/socket.io/socket.io.js
    // npm install socket.io-client

    const manager = new Manager('http://localhost:3001/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket('/');
    // console.log({socket});

    addListeners(  );
    
}

const addListeners = (  ) => {
    const serverStatusLabel = document.querySelector('#serverStatus')!;
    const clientsUl = document.querySelector('#clients-ul')!;

    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!; 

    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

    //escuchar eventos que vienen del servidor es con "on"
    // para hablar es con "emit"
    socket.on('connect', () => {
        console.log('connected');
        serverStatusLabel.innerHTML = 'connected';
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
        serverStatusLabel.innerHTML = 'disconnected';
    });

    //cuando se escuche el clients-update del servidor
    socket.on('clients-update', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `
            <li>${clientId}</li>
            `
        });
        
        clientsUl.innerHTML = clientsHtml;

    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        if ( messageInput.value.trim().length <= 0 ) return;

        //enviar un mensaje al servidor
        socket.emit('message-from-client', {
            id: 'YO!!', message: messageInput.value
        });

        messageInput.value = '';
        
    });

    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
        <li>
            <strong>${ payload.fullName}</strong>
            <span>${ payload.message}</span>
        </li>`;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.append( li );
    })
}