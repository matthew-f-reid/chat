import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

const SERVER_URL = 'http://192.168.0.3:3000/chat';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() { }

  initSocket(){
    this.socket = io(SERVER_URL);
  }

  joinRoom(sel){
    console.log("sel");
      console.log(sel);
    this.socket.emit("joinRoom", sel);
  }

  leaveRoom(sel){
    this.socket.emit("leaveRoom", sel);
  }

  joined(next){
    this.socket.on('joined', res=>next(res));
  }

  createRoom(newRoom){
    this.socket.emit('newRoom', newRoom);
  }

  reqNumUsers(sel){
    this.socket.emit('numUsers', sel);
  }

  getNumUsers(next){
    this.socket.on('numUsers', res=>next(res));
  }

  reqRoomList(){
    this.socket.emit('roomList', 'list please');
  }

  getRoomList(next){
    this.socket.on('roomList', res=>next(res));
  }

  notice(next){
    this.socket.on('notice', res=>next(res));
  }

  sendMessage(message){
    this.socket.emit('message', message);
  }

  getMessage(next){
    this.socket.on('message', message=>next(message));
  }

}
