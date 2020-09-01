import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  rolelist = "";
  name = "";
  email = "";
  roles = ['Super Admin', 'Group Admin', 'Group Assist'];
  users = [];
  user = "";
  password = "";
  currentRole = "";

  constructor(private route: ActivatedRoute, private httpclient: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
    this.name = this.route.snapshot.params.name;
    this.email = this.route.snapshot.params.email;
    this.rolelist = this.route.snapshot.params.rolelist;
    this.password = this.route.snapshot.params.password;
    this.currentRole = sessionStorage.getItem('role');
  }
  getUsers(){
    let userpwd = {name: this.name, password: this.email};
    this.httpclient.post(BACKEND_URL + '/getuser', userpwd, httpOptions)
    .subscribe((data: any) => {
      console.log(data);
      this.users = [];
      for(var i = 0; i < data.length; i++){
        this.users.push(data[i]);
      }
    });
  }
  
  addUser(){
    let user = {name: this.name, email: this.email, role: this.rolelist, password: this.password};
    this.httpclient.post(BACKEND_URL + '/adduser', user, httpOptions)
    .subscribe((data: any) => {
      this.users.push(data[data.length-1]);
      this.name = "";
      this.email = "";
      this.rolelist = "";
      this.password = "";
    });
    //this.getUsers();
  }
  updateUser(){

  }
  deleteUser(name){
    let user = {"name": name};
    this.httpclient.post(BACKEND_URL + '/deluser', user, httpOptions)
    .subscribe((data: any) => {
      this.users = data;
    });
  }

}
