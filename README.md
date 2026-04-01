# 🎓 SSCSE Faculty Feedback System

A full-stack web application that allows students to give feedback on faculty members and enables admins to analyze performance using dashboards, charts, and rankings.

-----------------

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration & Login (JWT-based)
- Role-based access (Student / Admin)

### 👨‍🏫 Faculty Module
- View all faculty members
- Search by name, department, designation
- Filter & sort faculties
- Pagination support

### 📝 Feedback System
- Submit feedback (rating + comment)
- View feedback for each faculty
- Edit & delete feedback (only by the same user)

### 🧠 Sentiment Analysis
- Automatically analyzes feedback comments
- Classifies as:
  - Positive 😊
  - Negative 😕
  - Neutral 😐

### 📊 Admin Dashboard
- Total faculties
- Total feedback
- Average rating
- Top-rated faculty
- Most reviewed faculty

### 📈 Data Visualization
- Bar chart of top-rated faculties

### 🏆 Faculty Leaderboard
- Ranking based on:
  - Average rating
  - Number of reviews
- Top 3 highlighted with medals 🥇🥈🥉

### 🌙 Dark / Light Mode
- Toggle theme
- Persistent using localStorage

-----------------

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS
- Recharts
- React Toastify

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- JSON Web Tokens (JWT)
- Bcrypt (password hashing)

-----------------

## 📂 Project Structure

client/
├── src/
│ ├── components/
│ │ ├── Login.js
│ │ ├── Register.js
│ │ ├── FacultyList.js
│ │ ├── AdminDashboard.js
│ ├── App.js
│ ├── App.css

server/
├── routes/
│ ├── authRoutes.js
│ ├── facultyRoutes.js
│ ├── feedbackRoutes.js
├── middleware/
│ ├── verifyToken.js
│ ├── verifyAdmin.js
├── config/
│ ├── db.js
├── index.js


------------------

## ⚙️ Installation & Setup

### Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

## Setup Backend
cd server
npm install

## Create .env file:
JWT_SECRET=your_secret_key

## Run server:
Node index.js

## Setup frontend:
cd client
npm install
npm start

-----------------

🌐 API Endpoints

## Auth
POST /register
POST /login

## Faculties
GET /faculties
POST /faculties (Admin only)

## Feedback
GET /faculties/:id/feedback
PUT /feedback/:id
DELETE /feedback/:id

## Admin
GET /admin/stats
GET /admin/top-rated
GET /admin/leaderboard


-----------------
