import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000/chat';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() { }

  initSocket() {
    this.socket = io(SERVER_URL);
  }

  joinRoom(room, user) {
    this.socket.emit("joinRoom", room, user);
  }

  leaveRoom(room, user) {
    this.socket.emit("leaveRoom", room, user);
  }

  joined(next) {
    this.socket.on('joined', res => next(res));
  }

  createRoom(newRoom) {
    this.socket.emit('newRoom', newRoom);
  }

  reqNumUsers(sel) {
    this.socket.emit('numUsers', sel);
  }

  getNumUsers(next) {
    this.socket.on('numUsers', res => next(res));
  }

  reqRoomList() {
    this.socket.emit('roomList', 'list please');
  }

  getRoomList(next) {
    this.socket.on('roomList', res => next(res));
  }

  notice(next) {
    this.socket.on('notice', res => next(res));
  }

  sendMessage(message, user) {
    this.socket.emit('message', message, user);
  }

  getMessage(next) {
    this.socket.on('message', message => next(message));
  }

}
