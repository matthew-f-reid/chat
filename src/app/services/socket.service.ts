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

  joinroom(sel){
    console.log("sel");
      console.log(sel);
    this.socket.emit("joinRoom", sel);
  }

  leaveroom(sel){
    this.socket.emit("leaveRoom", sel);
  }

  joined(next){
    this.socket.on('joined', res=>next(res));
  }

  createroom(newroom){
    this.socket.emit('newroom', newroom);
  }

  reqnumusers(sel){
    this.socket.emit('numusers', sel);
  }

  getnumusers(next){
    this.socket.on('numusers', res=>next(res));
  }

  reqroomList(){
    this.socket.emit('roomlist', 'list please');
  }

  getroomList(next){
    this.socket.on('roomlist', res=>next(res));
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
