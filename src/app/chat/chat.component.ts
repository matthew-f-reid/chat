import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const SERVER = 'http://192.168.0.3:3000';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messageContent = "";
  messages = [];
  groups = [];
  rooms = [];
  roomsList = "";
  roomNotice = "";
  currentRoom = "";
  inRoom = false;
  numUsers = 0;
  userRole = "";
  userName = "";

  constructor(private socketservice: SocketService, private httpclient: HttpClient) {
    if (sessionStorage.getItem('role')) {
      this.userRole = sessionStorage.getItem('role');
    }
    if (sessionStorage.getItem('name')) {
      this.userName = sessionStorage.getItem('name');
    }
    this.getRooms();
  }

  getRooms() {
    let name = { name: sessionStorage.getItem('name') };
    this.httpclient.post(SERVER + '/getgroup', name, httpOptions)
      .subscribe((data: any) => {
        this.groups = [];
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].rooms.length; j++) {
            for (var k = 0; k < data[i].rooms[j].roomUsers.length; k++) {
              if (data[i].rooms[j].roomUsers[k].name == this.userName) {
                let group = data[i].name;
                let room = data[i].rooms[j].name;
                let add = { group, room };
                this.rooms.push(add);
              }
            }
          }
        }
      });
  }

  joinRoom() {
    this.socketservice.joinRoom(this.roomsList, this.userName);
    this.socketservice.reqNumUsers(this.roomsList);
    this.socketservice.reqNumUsers((res) => { this.numUsers = res });
  }

  clearNotice() {
    this.roomNotice = "";
  }

  leaveRoom() {
    this.socketservice.leaveRoom(this.currentRoom, this.userName);
    this.socketservice.reqNumUsers(this.currentRoom);
    this.socketservice.reqNumUsers((res) => { this.numUsers = res });
    this.roomsList = null;
    this.currentRoom = "";
    this.inRoom = false;
    this.numUsers = 0;
    this.roomNotice = "";
    this.messages = [];
  }

  chat() {
    if (this.messageContent) {
      this.socketservice.sendMessage(this.messageContent, this.userName);
      this.messageContent = null;
      console.log(this.messages);
      
    } else {
      console.log("no message");
    }
  }

  ngOnInit(): void {
    this.socketservice.initSocket();
    this.socketservice.getMessage((m) => { this.messages.push({msg: m, name: this.userName}) });
    this.socketservice.reqRoomList();
    this.socketservice.getRoomList((msg) => { this.rooms = JSON.parse(msg) });
    this.socketservice.notice((msg) => { this.roomNotice = msg });
    this.socketservice.joined((msg) => {
      this.currentRoom = msg
      if (this.currentRoom != "") {
        this.inRoom = true;
      } else {
        this.inRoom = false;
      }
    });
  }
}
