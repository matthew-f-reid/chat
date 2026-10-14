import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_URL } from '../services/backend-url';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  name = "";
  password = "";
  valid;

  constructor(private route: ActivatedRoute, private router: Router, private httpclient: HttpClient) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.params.name;
    this.password = this.route.snapshot.params.password;
  }

  login() {
    const userpwd = { name: this.name, password: this.password };
    this.httpclient.post(BACKEND_URL + '/login', userpwd, httpOptions)
      .subscribe((data: any) => {
        if (data.valid) {
          sessionStorage.setItem('name', data.name);
          sessionStorage.setItem('role', data.role);
          sessionStorage.setItem('email', data.email);
          this.router.navigateByUrl('group');
        } else {
          alert("incorrect username or password");
        }
      });
  }
}
