import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClient {
    [id: string]: Socket // apunta a un socket
}

@Injectable()
export class MessagesWsService {

    private connectedClient: ConnectedClient = {}

    registerClinet( client: Socket ) {
        this.connectedClient[client.id] = client
        
    }

    removeClient( clientId: string ) {
        delete this.connectedClient[clientId];
    }

    getConnectedClients(): string[] {
        // return Object.keys(this.connectedClient).length;
        return Object.keys(this.connectedClient);
    }
}
