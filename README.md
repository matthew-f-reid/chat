# Chatter

Chatter is a responsive group chat website for organizing people into groups and rooms. It uses an Angular frontend, an Express and Socket.IO backend, and MongoDB for accounts, groups, room membership, join requests, and account notifications.

## Features

- **Accounts and roles:** Sign in with an account stored in MongoDB. The available roles are Super Admin, Group Admin, Group Assist, and User.
- **Group discovery and membership:** Browse groups and request to join. Group and Super Admins can accept or reject group requests.
- **Group and room management:** Create groups and rooms, manage members, and remove groups, rooms, or members. Group Assist users can create groups and rooms and manage room membership.
- **Room access requests:** Group members can request access to individual rooms. Admins can accept or reject requests.
- **Notifications:** Online admins receive live join-request notifications with Accept and Reject actions. Admins can also review pending requests on the Groups page. Requesters receive a saved account notification when an admin accepts or rejects a request; notifications remain until dismissed.
- **Live chat:** Chat in rooms to which the signed-in user has access. Messages show the actual sender. The room view shows who is online and recent join/leave activity.
- **Responsive interface:** A black, white, and red theme with layouts for phones, tablets, and desktop screens.
- **Local network access:** The development servers bind to the PC's network interfaces so another device on the same LAN can access the site.

## Requirements

- Node.js and npm. This project uses Angular 10 and older Socket.IO dependencies; use a Node version compatible with those dependencies rather than the latest Node release. The project has previously run with Node 14.15.1.
- MongoDB running on the same PC at `mongodb://localhost:27017/`.
- A modern browser.

## Run locally on Windows

Install the frontend dependencies from the project root:

```powershell
npm install
```

Install the backend dependencies:

```powershell
cd server
npm install
```

Start MongoDB, then run the backend in one terminal:

```powershell
cd C:\webdev\matthew-f-reid\chat\server
node server-mongo.js
```

Run the Angular development server in a second terminal:

```powershell
cd C:\webdev\matthew-f-reid\chat
npm start
```

On the PC, open <http://localhost:4200>. The frontend uses port `4200`; the API and chat sockets use port `3000`.

### Open Chatter on a phone or another PC

1. Keep both servers running on the host PC.
2. Find the PC's current IPv4 address with `ipconfig` (use the address for its Wi-Fi or Ethernet adapter).
3. On a device connected to the same non-guest network, open `http://<PC-IP>:4200`, replacing `<PC-IP>` with that address. For example: `http://192.168.0.111:4200`.
4. If the page does not load, allow Node.js through Windows Firewall on private networks and check that the Wi-Fi does not isolate devices from each other.

The frontend derives its API and Socket.IO host from the address used to open the site. Do not use `localhost` on the phone: that refers to the phone itself.

## Data storage

The backend connects to the MongoDB database named `chatter`:

- `users` stores account profiles (`name`, `email`, `role`, `password`) and saved account notifications.
- `groups` stores groups, their member lists, rooms, room-member lists, and pending group/room join requests.

The application currently expects MongoDB at `localhost:27017`; configure MongoDB and start it before the backend.

## Useful commands

Run these from the project root:

```powershell
npm start       # Start Angular on all network interfaces, port 4200
npm run build   # Build the Angular application
npm test        # Run Angular unit tests
npm run lint    # Run Angular lint checks
```

The active MongoDB backend is `server/server-mongo.js`. `server/server.js` and `server/obsolete/` contain legacy implementations and are not used by the documented startup command.

## Development and security notes

This is a local-development project, not a production-ready deployment. Login currently compares stored passwords directly, and the backend does not use authenticated sessions or tokens for API authorization. Role checks in the interface should not be treated as a security boundary. Do not expose this application or its development servers to the public internet without implementing proper password hashing, authentication, authorization, transport security, and production deployment configuration.
