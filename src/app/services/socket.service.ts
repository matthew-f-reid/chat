import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { BACKEND_URL } from './backend-url';

const SERVER_URL = BACKEND_URL + '/chat';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private joinRequestDecisionSubject = new Subject<any>();
  private hasJoinRequestDecisionListener = false;

  constructor() { }

  initSocket() {
    if (!this.socket) {
      this.socket = io(SERVER_URL);
    }
  }

  registerGroupAdmin(name, role) {
    this.initSocket();
    this.socket.emit('registerGroupAdmin', { name, role });
  }

  onGroupJoinRequest(next) {
    this.initSocket();
    this.socket.removeAllListeners('groupJoinRequest');
    this.socket.on('groupJoinRequest', request => next(request));
  }

  onJoinRequestDecision(): Observable<any> {
    this.initSocket();
    if (!this.hasJoinRequestDecisionListener) {
      this.socket.on('joinRequestDecision', decision => this.joinRequestDecisionSubject.next(decision));
      this.hasJoinRequestDecisionListener = true;
    }
    return this.joinRequestDecisionSubject.asObservable();
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

  getNumUsers(next) {
    this.socket.on('numusers', res => next(res));
  }

  onRoomUsers(next: (users: string[]) => void) {
    this.initSocket();
    this.socket.on('roomUsers', users => next(users));
  }

  onRoomPresence(next: (presence: { user: string; action: string }) => void) {
    this.initSocket();
    this.socket.on('roomPresence', presence => next(presence));
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  getMessage(next) {
    this.socket.on('message', (message, user) => next(message, user));
  }

}
