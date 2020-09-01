import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chat';
  loggedIn = true;

  constructor(private route: ActivatedRoute, private router: Router) {   }

  logout(){
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }
}
