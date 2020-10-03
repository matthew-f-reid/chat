import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
const BACKEND_URL = 'http://192.168.0.3:3000';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  rolelist = "";
  name = "";
  email = "";
  users = [];
  user = "";
  password = "";
  currentRole = "";
  id = "";

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
      console.log(this.users);
      
    });
  }

  addUser(){
    let user = {name: this.name, email: this.email, role: this.rolelist, password: this.password};
    this.httpclient.post(BACKEND_URL + '/adduser', user, httpOptions)
    .subscribe((data: any) => {
      this.name = "";
      this.email = "";
      this.rolelist = "";
      this.password = "";
      this.users = [];
      for(var i = 0; i < data.length; i++){
        this.users.push(data[i]);
      }
    });
  }
  updateUser(id, name, email, password, role){
    let user = {id: id, name: name, email: email, role: role, password: password};
    this.httpclient.post(BACKEND_URL + '/updateuser', user, httpOptions)
    .subscribe((data: any) => {
      
      this.users = [];
      for(var i = 0; i < data.length; i++){

        this.users.push(data[i]);
      }
      console.log(data);
      console.log(this.users);
    });
  }
  deleteUser(name){
    let user = {"name": name};
    this.httpclient.post(BACKEND_URL + '/deluser', user, httpOptions)
    .subscribe((data: any) => {
      this.users = [];
      for(var i = 0; i < data.length; i++){
        this.users.push(data[i]);
      }
    });
  }

}
