import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
const BACKEND_URL = 'http://192.168.0.3:3000';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups = [];
  totalUsers = [];
  currentUserRole;

  constructor(private route: ActivatedRoute, private httpclient: HttpClient) { }

  ngOnInit(): void {
    this.getGroups();
    this.getUsers();
    this.getCurrentUser();
    console.log(this.groups);
    console.log(this.totalUsers);
    console.log(this.currentUserRole);
    
    
    
  }
  getCurrentUser(){
    if(sessionStorage.getItem('role')){
      this.currentUserRole = sessionStorage.getItem('role');
    }
  }
  getGroups(){
    if(sessionStorage.getItem('name')){
      let name = {name: sessionStorage.getItem('name')};
      this.httpclient.post(BACKEND_URL + '/getgroup', name, httpOptions)
      .subscribe((data: any) => {
        this.groups = [];
        for(var i = 0; i < data.length; i++){
          this.groups.push(data[i]);
        }
      });
    }
  }
  getUsers(){
    let allUsers = {allUsers:true};
    this.httpclient.post(BACKEND_URL + '/getuser', allUsers, httpOptions)
    .subscribe((data: any) => {
      console.log(data);
      
      this.totalUsers = [];
      for(var i = 0; i < data.length; i++){
        this.totalUsers.push(data[i]);
      }
    });
  }
  addUser2G(user, group){
    let addUser = {user: user, group};
    this.httpclient.post(BACKEND_URL + '/adduser2g', addUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
    
    
  }
  addUser2R(user, room, group){///////////////////////////////////////////////////
    let addUser = {user: user, room: room, group};
    this.httpclient.post(BACKEND_URL + '/adduser2r', addUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
    
  }
  addGroup(groupName){
    let userName = sessionStorage.getItem('name');
    let addGroup = {group: groupName, user: userName};
    this.httpclient.post(BACKEND_URL + '/addgroup', addGroup, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
  
  addRoom(groupID, roomName){
    let userName = sessionStorage.getItem('name');
    console.log(groupID);
    
    let addRoom = {groupID, room: roomName, user: userName};
    this.httpclient.post(BACKEND_URL + '/addroom', addRoom, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }  
  delRoom(roomName, groupID){
    console.log(groupID);
    
    let delRoom = {groupID, room: roomName};
    
    this.httpclient.post(BACKEND_URL + '/delroom', delRoom, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }

  delGroup(groupName){
    let delGroup = {group: groupName};
    this.httpclient.post(BACKEND_URL + '/delgroup', delGroup, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
  delUser2R(user, room, group){//////////////////////////////////////
    let delUser = {group, user: user, room: room};
    this.httpclient.post(BACKEND_URL + '/deluser2r', delUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
  delUser2G(user, group){
    let delUser = {group, user: user};
    this.httpclient.post(BACKEND_URL + '/deluser2g', delUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
}
