import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';

const SERVER_URL = 'http://localhost:3000';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private socket;
  messagecontent = "";
  messages = [];
  rooms = [];
  roomslist = "";
  roomnotice = "";
  currentroom = "";
  isinRoom = false;
  newroom = "";
  numusers = 0;

  constructor(private socketservice:SocketService, private route: ActivatedRoute) {
   }

  joinroom(){
    this.socketservice.joinroom(this.roomslist);
    this.socketservice.reqnumusers(this.roomslist);
    this.socketservice.getnumusers((res)=>{this.numusers = res});
  }

  clearnotice(){
    this.roomslist = "";
  }

  leaveroom(){
    this.socketservice.leaveroom(this.currentroom);
    this.socketservice.reqnumusers(this.currentroom);
    this.socketservice.getnumusers((res)=>{this.numusers = res});
    this.roomslist = null;
    this.currentroom = "";
    this.isinRoom = false;
    this.numusers = 0;
    this.roomnotice = ""
    this.messages = [];
  }

  createroom(){
    this.socketservice.createroom(this.newroom);
    this.socketservice.reqroomList();
    this.newroom = "";
  }

  chat(){
    if(this.messagecontent){
      this.socketservice.sendMessage(this.messagecontent);
      this.messagecontent = null;
    } else {
      console.log("no message");
    }
  }

  ngOnInit(): void {
    this.socketservice.initSocket();
    this.socketservice.getMessage((m)=>{this.messages.push(m)});
    this.socketservice.reqroomList();
    this.socketservice.getroomList((msg)=>{this.rooms = JSON.parse(msg)});
    this.socketservice.notice((msg)=>{this.roomnotice = msg});
    this.socketservice.joined((msg)=>{this.currentroom = msg
      if(this.currentroom != ""){
        this.isinRoom = true;
      } else {
        this.isinRoom = false;
      }
    });
  }

}
