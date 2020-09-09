import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';

const SERVER = 'http://192.168.0.3:3000';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private socket;
  messageContent = "";
  messages = [];
  rooms = ['room1','room2'];
  roomsList = "";
  roomNotice = "";
  currentRoom = "";
  inRoom = false;
  newRoom = "";
  numUsers = 0;
  userRole = "";

  constructor(private socketservice:SocketService, private route: ActivatedRoute) {
    if(sessionStorage.getItem('role')){
      this.userRole = sessionStorage.getItem('role');
    }
   }

  joinRoom(){
    this.socketservice.joinRoom(this.roomsList);
    this.socketservice.reqNumUsers(this.roomsList);
    this.socketservice.reqNumUsers((res)=>{this.numUsers = res});
  }

  clearNotice(){
    this.roomNotice = "";
  }

  leaveRoom(){
    this.socketservice.leaveRoom(this.currentRoom);
    this.socketservice.reqNumUsers(this.currentRoom);
    this.socketservice.reqNumUsers((res)=>{this.numUsers = res});
    this.roomsList = null;
    this.currentRoom = "";
    this.inRoom = false;
    this.numUsers = 0;
    this.roomNotice = ""
    this.messages = [];
  }

  createRoom(){
    this.socketservice.createRoom(this.newRoom);
    this.socketservice.reqRoomList();
    this.newRoom = "";
  }

  chat(){
    if(this.messageContent){
      this.socketservice.sendMessage(this.messageContent);
      this.messageContent = null;
    } else {
      console.log("no message");
    }
  }

  ngOnInit(): void {
    this.socketservice.initSocket();
    this.socketservice.getMessage((m)=>{this.messages.push(m)});
    this.socketservice.reqRoomList();
    this.socketservice.getRoomList((msg)=>{this.rooms = JSON.parse(msg)});
    this.socketservice.notice((msg)=>{this.roomNotice = msg});
    this.socketservice.joined((msg)=>{this.currentRoom = msg
      if(this.currentRoom != ""){
        this.inRoom = true;
      } else {
        this.inRoom = false;
      }
    });
  }

}
