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
      this.totalUsers = [];
      for(var i = 0; i < data.length; i++){
        this.totalUsers.push(data[i]);
      }
    });
  }
  addUser2G(user, group){
    let addUser = {type: 'adduser2G', user: user, group: group};
    this.httpclient.post(BACKEND_URL + '/addgroup', addUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
    
    
  }
  addUser2R(user, room, group){
    let addUser = {type: 'adduser2R', user: user, room: room, group: group};
    this.httpclient.post(BACKEND_URL + '/addgroup', addUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
    
  }
  addGroup(groupName){
    let userName = sessionStorage.getItem('name');
    let addGroup = {type: 'addgroup', group: groupName, user: userName};
    this.httpclient.post(BACKEND_URL + '/addgroup', addGroup, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
  
  addRoom(roomName, groupName){
    let userName = sessionStorage.getItem('name');
    let addRoom = {type: 'addroom', group: groupName, room: roomName, user: userName};
    this.httpclient.post(BACKEND_URL + '/addgroup', addRoom, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }  
  delRoom(roomName, groupName){
    let addRoom = {type: 'delroom', group: groupName, room: roomName};
    this.httpclient.post(BACKEND_URL + '/addgroup', addRoom, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }

  delGroup(groupName){
    let addRoom = {type: 'delgroup', group: groupName};
    this.httpclient.post(BACKEND_URL + '/addgroup', addRoom, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
  delUser2R(user, room, group){
    let delUser = {type: 'deluser2R', group: group, user: user, room: room};
    this.httpclient.post(BACKEND_URL + '/addgroup', delUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
  delUser2G(user, group){
    let delUser = {type: 'deluser2G', group: group, user: user};
    this.httpclient.post(BACKEND_URL + '/addgroup', delUser, httpOptions)
    .subscribe((data: any) => {
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
    });
  }
}
