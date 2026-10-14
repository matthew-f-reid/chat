import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SocketService } from '../services/socket.service';
import { BACKEND_URL } from '../services/backend-url';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups = [];
  totalUsers = [];
  currentUserRole;
  selectedGroupId = null;
  currentUserName = '';
  joinRequestFeedback = '';
  isManagingGroups = false;
  newGroupName = '';
  isAddRoomModalOpen = false;
  roomModalGroupId = null;
  roomName = '';
  roomModalError = '';
  isAddingRoom = false;

  constructor(private httpclient: HttpClient, private socketService: SocketService) { }

  ngOnInit(): void {
    this.getGroups();
    this.getUsers();
    this.getCurrentUser();
    this.socketService.onJoinRequestDecision().subscribe(decision => {
      if (decision.user === this.currentUserName) {
        this.joinRequestFeedback = decision.decision === 'approved'
          ? 'Your request was accepted.'
          : 'Your request was rejected.';
        this.getGroups();
      }
    });
  }

  getCurrentUser() {
    this.currentUserName = sessionStorage.getItem('name') || '';
    if (sessionStorage.getItem('role')) {
      this.currentUserRole = sessionStorage.getItem('role');
    }
    if (this.isGroupAdmin()) {
      this.socketService.registerGroupAdmin(this.currentUserName, this.currentUserRole);
    }
  }

  getGroups() {
    if (sessionStorage.getItem('name')) {
      let name = { name: sessionStorage.getItem('name') };
      this.httpclient.post(BACKEND_URL + '/getgroup', name, httpOptions)
        .subscribe((data: any) => {
          this.setGroups(data);
        });
    }
  }

  selectGroup(group) {
    this.selectedGroupId = group._id;
    this.joinRequestFeedback = '';
  }

  toggleGroupManagement() {
    this.isManagingGroups = !this.isManagingGroups;
    this.joinRequestFeedback = '';
  }

  canManageGroupContent() {
    return this.isGroupAdmin() || this.currentUserRole === 'Group Assist';
  }

  private setGroups(groups) {
    this.groups = groups;
    if (!this.groups.some(group => group._id === this.selectedGroupId)) {
      this.selectedGroupId = this.groups.length ? this.groups[0]._id : null;
    }
  }

  isGroupAdmin() {
    return this.currentUserRole === 'Super Admin' || this.currentUserRole === 'Group Admin';
  }

  hasPendingJoinRequests() {
    return this.groups.some(group =>
      (group.joinRequests || []).length > 0 ||
      (group.rooms || []).some(room => (room.joinRequests || []).length > 0)
    );
  }

  isGroupMember(group) {
    return (group.users || []).some(member => member.name === this.currentUserName);
  }

  hasGroupRequest(group) {
    return (group.joinRequests || []).some(request => request.user === this.currentUserName);
  }

  isRoomMember(room) {
    return (room.roomUsers || []).some(member => member.name === this.currentUserName);
  }

  hasRoomRequest(room) {
    return (room.joinRequests || []).some(request => request.user === this.currentUserName);
  }

  requestGroupAccess(group) {
    this.httpclient.post(BACKEND_URL + '/requestgroup', {
      group: group._id,
      user: this.currentUserName
    }, httpOptions).subscribe(() => {
      this.joinRequestFeedback = 'Group access requested.';
      this.getGroups();
    }, () => {
      this.joinRequestFeedback = 'Could not request group access. Please try again.';
    });
  }

  requestRoomAccess(group, room) {
    this.httpclient.post(BACKEND_URL + '/requestroom', {
      group: group._id,
      room: room.name,
      user: this.currentUserName
    }, httpOptions).subscribe(() => {
      this.joinRequestFeedback = 'Room access requested.';
      this.getGroups();
    }, () => {
      this.joinRequestFeedback = 'Could not request room access. Please try again.';
    });
  }

  decideJoinRequest(group, user, type, room, approve) {
    this.httpclient.post(BACKEND_URL + '/decidejoinrequest', {
      group: group._id,
      user,
      type,
      room,
      reviewer: this.currentUserName,
      approve
    }, httpOptions).subscribe(() => {
      this.joinRequestFeedback = approve ? 'Request approved.' : 'Request rejected.';
      this.getGroups();
    }, () => {
      this.joinRequestFeedback = 'Could not update the request. Please try again.';
    });
  }

  getUsers() {
    const allUsers = { allUsers: true };
    this.httpclient.post(BACKEND_URL + '/getuser', allUsers, httpOptions)
      .subscribe((data: any) => {
        this.totalUsers = data;
      });
  }

  addUser2G(user, group) {
    let addUser = { user: user, group };
    this.httpclient.post(BACKEND_URL + '/adduser2g', addUser, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
      });
  }

  addUser2R(user, room, group) {
    let addUser = { user: user, room: room, group };
    this.httpclient.post(BACKEND_URL + '/adduser2r', addUser, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
      });
  }

  addGroup() {
    const groupName = this.newGroupName.trim();
    if (!groupName) {
      return;
    }
    let userName = sessionStorage.getItem('name');
    let addGroup = { group: groupName, user: userName };
    this.httpclient.post(BACKEND_URL + '/addgroup', addGroup, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
        this.newGroupName = '';
      });
  }

  openAddRoomModal(group) {
    this.roomModalGroupId = group._id;
    this.roomName = '';
    this.roomModalError = '';
    this.isAddRoomModalOpen = true;
  }

  closeAddRoomModal() {
    if (this.isAddingRoom) {
      return;
    }
    this.isAddRoomModalOpen = false;
    this.roomModalGroupId = null;
    this.roomModalError = '';
  }

  addRoom(groupID, roomName) {
    let userName = sessionStorage.getItem('name');
    let addRoom = { groupID: { _id: groupID }, room: roomName, user: userName };
    this.isAddingRoom = true;
    this.roomModalError = '';
    this.httpclient.post(BACKEND_URL + '/addroom', addRoom, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
        this.isAddingRoom = false;
        this.isAddRoomModalOpen = false;
        this.roomModalGroupId = null;
        this.roomName = '';
      }, () => {
        this.isAddingRoom = false;
        this.roomModalError = 'Could not add the room. Please try again.';
      });
  }

  delRoom(roomName, groupID) {
    let delRoom = { groupID, room: roomName };
    this.httpclient.post(BACKEND_URL + '/delroom', delRoom, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
      });
  }

  delGroup(groupName) {
    let delGroup = { group: groupName };
    this.httpclient.post(BACKEND_URL + '/delgroup', delGroup, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
      });
  }

  delUser2R(user, room, group) {
    let delUser = { group, user: user, room: room };
    this.httpclient.post(BACKEND_URL + '/deluser2r', delUser, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
      });
  }

  delUser2G(user, group) {
    let delUser = { group, user: user };
    this.httpclient.post(BACKEND_URL + '/deluser2g', delUser, httpOptions)
      .subscribe((data: any) => {
        this.setGroups(data);
      });
  }
}
