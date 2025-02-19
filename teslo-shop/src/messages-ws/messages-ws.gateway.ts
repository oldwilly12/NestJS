import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server; //wss tiene la info de todos los clientes

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}
  // http://localhost:3001/socket.io/socket.io.js   
  // para el tipo Socket se instala "yarn add socket.io"
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify( token );
      await this.messagesWsService.registerClinet(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    //console.log({payload});
    // console.log({token});
    //console.log('Client connected:', client.id);
    
    
    // console.log({conectados: this.messagesWsService.getConnectedClients()});
    // estamos mandando el evento a todos los clientes conectados, el cliente debe estar pendiente de este evento "clients-update"
    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    //console.log('Client disconnected:', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-update', this.messagesWsService.getConnectedClients());
  }

  //message-from-client
  // decorador el cual espera el nombre del evento que estamos esperando 
  // se teiene acceso el cliente tipo socket y el peyload any
  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    
    console.log(client.id, payload);

    //! Emite unicamente al cliente
    //! el listado de articulos al cliente si es que se quiere al cliente acutal
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });


    //! emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });

    //! emitir a todos y al cliente inical (yo)
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });

  }


}
