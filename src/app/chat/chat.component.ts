import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_URL } from '../services/backend-url';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messageContent = "";
  messages = [];
  rooms = [];
  roomsList = "";
  currentRoom = "";
  inRoom = false;
  numUsers = 0;
  roomUsers = [];
  roomActivities = [];
  userName = "";

  constructor(private socketservice: SocketService, private httpclient: HttpClient) {
    this.userName = sessionStorage.getItem('name') || '';
    this.getRooms();
  }

  getRooms() {
    let name = { name: sessionStorage.getItem('name') };
    this.httpclient.post(BACKEND_URL + '/getgroup', name, httpOptions)
      .subscribe((data: any) => {
        this.rooms = [];
        data.forEach(group => {
          (group.rooms || []).forEach(room => {
            if ((room.roomUsers || []).some(member => member.name === this.userName)) {
              this.rooms.push({ group: group.name, room: room.name });
            }
          });
        });
      });
  }

  joinRoom() {
    this.messages = [];
    this.roomActivities = [];
    this.socketservice.joinRoom(this.roomsList, this.userName);
  }

  leaveRoom() {
    this.socketservice.leaveRoom(this.currentRoom, this.userName);
    this.roomsList = null;
    this.currentRoom = "";
    this.inRoom = false;
    this.numUsers = 0;
    this.roomUsers = [];
    this.roomActivities = [];
    this.messages = [];
  }

  chat() {
    if (this.messageContent) {
      this.socketservice.sendMessage(this.messageContent);
      this.messageContent = "";
    }
  }

  ngOnInit(): void {
    this.socketservice.initSocket();
    this.socketservice.getMessage((message, user) => {
      this.messages.push({ msg: message, name: user });
    });
    this.socketservice.onRoomUsers(users => {
      this.roomUsers = users;
      this.numUsers = users.length;
    });
    this.socketservice.onRoomPresence(presence => {
      this.roomActivities.unshift({
        user: presence.user,
        action: presence.action
      });
      this.roomActivities = this.roomActivities.slice(0, 5);
    });
    this.socketservice.joined((msg) => {
      this.currentRoom = msg;
      if (this.currentRoom != "") {
        this.inRoom = true;
      } else {
        this.inRoom = false;
      }
    });
    this.socketservice.getNumUsers(count => { this.numUsers = count; });
  }
}
