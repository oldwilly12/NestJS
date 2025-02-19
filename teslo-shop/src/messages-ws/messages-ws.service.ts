import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClient {
    [id: string]: {
        socket:Socket, // apunta a un socket
        user: User,
    }
}

@Injectable()
export class MessagesWsService {

    private connectedClient: ConnectedClient = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    async registerClinet( client: Socket, userId: string  ) {

        const user = await this.userRepository.findOneBy({ id: userId });
        if ( !user ) throw new Error('User not found');
        if ( !user.isActive ) throw new Error('User is Inactive, talk with an admin');

        this.checkUserConnection( user );

        this.connectedClient[client.id] = {
            socket:client,
            user: user
        }
        
    }

    removeClient( clientId: string ) {
        delete this.connectedClient[clientId];
    }

    getConnectedClients(): string[] {
        // console.log(this.connectedClient);
        // return Object.keys(this.connectedClient).length;
        return Object.keys(this.connectedClient);
    }

    getUserFullName( socketId: string ) {
        return this.connectedClient[socketId].user.fullName;
    } 

    private checkUserConnection( user: User ) {
        for (const clientId of Object.keys(this.connectedClient)) {
            const connectedClient = this.connectedClient[clientId];

            if ( connectedClient.user.id === user.id ) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
}
