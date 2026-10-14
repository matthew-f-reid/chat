import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_URL } from '../services/backend-url';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
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
  isAddUserModalOpen = false;

  constructor(private route: ActivatedRoute, private router: Router, private httpclient: HttpClient) { }

  ngOnInit(): void {
    this.currentRole = sessionStorage.getItem('role');
    if (this.currentRole === 'User') {
      this.router.navigateByUrl('/group');
      return;
    }
    this.getUsers();
    this.name = this.route.snapshot.params.name;
    this.email = this.route.snapshot.params.email;
    this.rolelist = this.route.snapshot.params.rolelist;
    this.password = this.route.snapshot.params.password;
  }

  getUsers() {
    let userpwd = { name: this.name, password: this.email };
    this.httpclient.post(BACKEND_URL + '/getuser', userpwd, httpOptions)
      .subscribe((data: any) => {
        this.users = [];
        for (var i = 0; i < data.length; i++) {
          this.users.push(data[i]);
        }
      });
  }

  openAddUserModal() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.rolelist = "";
    this.isAddUserModalOpen = true;
  }

  closeAddUserModal() {
    this.isAddUserModalOpen = false;
  }

  addUser() {
    let user = { name: this.name, email: this.email, role: this.rolelist, password: this.password };
    this.httpclient.post(BACKEND_URL + '/adduser', user, httpOptions)
      .subscribe((data: any) => {
        this.closeAddUserModal();
        this.name = "";
        this.email = "";
        this.rolelist = "";
        this.password = "";
        this.users = [];
        for (var i = 0; i < data.length; i++) {
          this.users.push(data[i]);
        }
      });
  }

  updateUser(id, name, email, password, role) {
    let user = { id: id, name: name, email: email, role: role, password: password };
    this.httpclient.post(BACKEND_URL + '/updateuser', user, httpOptions)
      .subscribe((data: any) => {
        this.users = [];
        for (var i = 0; i < data.length; i++) {
          this.users.push(data[i]);
        }
      });
  }

  deleteUser(name) {
    let user = { "name": name };
    this.httpclient.post(BACKEND_URL + '/deluser', user, httpOptions)
      .subscribe((data: any) => {
        this.users = [];
        for (var i = 0; i < data.length; i++) {
          this.users.push(data[i]);
        }
      });
  }
}
