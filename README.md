# 💬Group Chat Application

A real-time, secure, and scalable backend API for a group chat system, built with Node.js, Express, MongoDB, and Socket.io. Supports group creation, messaging, user roles (admin), and encrypted communication. Ideal for teams or social chat platforms.

---

## ✅ Features

- User signup & login with JWT authentication
- Create and join multiple chat groups
- Real-time messaging using Socket.io
- End-to-end encrypted messages
- Group admin controls:
  - Add/remove users
  - Promote users to admin
- View message history per group
- Authenticated access to chat features

---

## 📁 Project Structure

├── app.js
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── utils/
├── socket/
├── .env
└── README.md

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Socket.io** – Real-time communication
- **JWT** – User authentication
- **bcrypt** – Password hashing
- **dotenv** – Env configuration
- **CORS** – Cross-origin support
- **Helmet** – Secure HTTP headers

---

## 🔐 Authentication

All endpoints (except signup/login) are protected with JWT.  
Pass token in the `Authorization` header like:
`Authorization: Bearer <token>`

---

## 🚀 API Endpoints

### 👤 Auth

- `POST /api/auth/signup` – Register new user  
- `POST /api/auth/login` – Login and get token  

### 🧑‍🤝‍🧑 Group

- `POST /api/groups/` – Create a new group  
- `GET /api/groups/` – Get all groups user belongs to  
- `GET /api/groups/:groupId` – Get group details  
- `DELETE /api/groups/:groupId` – Delete group (admin only)  

### 🙋‍♂️ Group Members

- `POST /api/groups/:groupId/add` – Add user to group (admin only)  
- `POST /api/groups/:groupId/promote` – Promote user to admin  
- `DELETE /api/groups/:groupId/remove/:userId` – Remove user from group  

### 💬 Messages

- `POST /api/messages/:groupId` – Send message to group  
- `GET /api/messages/:groupId` – Get message history of group (paginated)  

---

## 🔌 Real-time Messaging (Socket.io)

When a user joins a group via frontend:
- Socket emits a `joinGroup` event
- Messages sent emit a `newMessage` event
- All group users receive the new message instantly

Socket Events:
- `joinGroup` – Join specific group room  
- `sendMessage` – Emit message  
- `receiveMessage` – Listen for new message  

---

## 🧪 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
2. **Install dependencies**
   ```bash
   npm install

3. **Configure .env**
   ```bash
   MONGO_URI=
   JWT_SECRET=
   PORT=5000
   
4. **Run the server**
   ```bash
   npm start

  ---
  
---

## 🧪 Testing the API

Use **Postman** or **Thunder Client**.  
Login to get JWT and set this in header: Set `Authorization: Bearer <token>`

**Use **Socket.io** client (e.g., from frontend) to test real-time events:**
- Connect via socket
- Join room via `joinGroup` event
- Emit and listen to `sendMessage` and `receiveMessage` events

---

## 👨‍💻 Author

**Sumit Patil**  
GitHub: @Sumitp92
