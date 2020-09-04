import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ChatComponent } from './chat/chat.component';
import { UserComponent } from './user/user.component';
import { GroupComponent } from './group/group.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'user', component: UserComponent},
  {path: 'group', component: GroupComponent},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
