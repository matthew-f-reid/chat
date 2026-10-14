import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './services/socket.service';
import { BACKEND_URL } from './services/backend-url';

interface JoinRequestNotification {
  type: 'group' | 'room';
  user: string;
  group: string;
  groupId: string;
  room?: string;
}

interface AccountNotification {
  _id: string;
  message: string;
  isDismissing?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chat';
  joinRequestNotification = '';
  activeJoinRequest: JoinRequestNotification = null;
  joinRequestActionError = '';
  isHandlingJoinRequest = false;
  accountNotifications: AccountNotification[] = [];
  accountNotificationError = '';

  constructor(
    private router: Router,
    private socketService: SocketService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.socketService.onGroupJoinRequest((request: JoinRequestNotification) => {
      this.activeJoinRequest = request;
      this.joinRequestActionError = '';
      this.joinRequestNotification = request.type === 'room'
        ? request.user + ' requested access to ' + request.group + ' / ' + request.room
        : request.user + ' requested to join ' + request.group;
    });
    this.socketService.onJoinRequestDecision().subscribe((decision: any) => {
      const signedInName = sessionStorage.getItem('name');
      if (decision.user === signedInName && decision.notification) {
        this.addAccountNotification(decision.notification);
      }
    });
    const userName = sessionStorage.getItem('name');
    if (userName) {
      this.http.post<AccountNotification[]>(BACKEND_URL + '/getnotifications', {
        user: userName
      }).subscribe(notifications => {
        notifications.forEach(notification => this.addAccountNotification(notification));
      }, error => {
        console.error('Could not load account notifications', error);
      });
    }
    const role = sessionStorage.getItem('role');
    if (role === 'Super Admin' || role === 'Group Admin') {
      this.socketService.registerGroupAdmin(sessionStorage.getItem('name') || '', role);
    }
  }

  private addAccountNotification(notification: AccountNotification) {
    if (!this.accountNotifications.some(item => item._id === notification._id)) {
      this.accountNotifications = [notification, ...this.accountNotifications];
    }
  }

  dismissAccountNotification(notification: AccountNotification) {
    if (notification.isDismissing) {
      return;
    }
    notification.isDismissing = true;
    this.accountNotificationError = '';
    this.http.post(BACKEND_URL + '/dismissnotification', {
      user: sessionStorage.getItem('name') || '',
      notification: notification._id
    }).subscribe(() => {
      this.accountNotifications = this.accountNotifications.filter(item => item._id !== notification._id);
    }, error => {
      notification.isDismissing = false;
      this.accountNotificationError = 'Could not dismiss this notification. Please try again.';
      console.error('Could not dismiss account notification', error);
    });
  }

  decideJoinRequest(approve: boolean) {
    if (!this.activeJoinRequest || this.isHandlingJoinRequest) {
      return;
    }

    this.isHandlingJoinRequest = true;
    this.joinRequestActionError = '';
    this.http.post(BACKEND_URL + '/decidejoinrequest', {
      group: this.activeJoinRequest.groupId,
      user: this.activeJoinRequest.user,
      type: this.activeJoinRequest.type,
      room: this.activeJoinRequest.room || null,
      reviewer: sessionStorage.getItem('name') || '',
      approve
    }).subscribe(() => {
      this.joinRequestNotification = approve ? 'Join request accepted.' : 'Join request rejected.';
      this.activeJoinRequest = null;
      this.isHandlingJoinRequest = false;
    }, () => {
      this.joinRequestActionError = 'Could not update the request. Please try again from Groups.';
      this.isHandlingJoinRequest = false;
    });
  }

  dismissJoinRequestNotification() {
    this.joinRequestNotification = '';
    this.activeJoinRequest = null;
    this.joinRequestActionError = '';
  }

  get loggedIn(): boolean {
    return !!sessionStorage.getItem('name') && !!sessionStorage.getItem('role');
  }

  get currentUserName(): string {
    return sessionStorage.getItem('name') || '';
  }

  get canManageUsers(): boolean {
    const role = sessionStorage.getItem('role');
    return this.loggedIn && (role === 'Super Admin' || role === 'Group Admin');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }
}
