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

  constructor(private route: ActivatedRoute, private httpclient: HttpClient) { }

  ngOnInit(): void {
    this.getGroups();
    this.getUsers();
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
        console.log(this.groups);
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
      console.log(this.totalUsers);
    });
  }
  addUser(user, group){
    console.log(user);
    console.log(group);
    
    let addUser = {type: 'adduser', user: user, group: group};
    this.httpclient.post(BACKEND_URL + '/addgroup', addUser, httpOptions)
    .subscribe((data: any) => {
      
      this.groups = [];
      for(var i = 0; i < data.length; i++){
        this.groups.push(data[i]);
      }
      
      console.log(data);
    });
    
  }

}