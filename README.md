## Setup

### 1. Database

- **Log In**:
  - psql -U [username] -d [databasename]
- **Create Database**:
  - CREATE DATABASE taskdemo
- **Connect to taskdemo**
  - \c taskdemo
- **Create users and tasks table**
  - CREATE TABLE users 
    (id BIGSERIAL PRIMARY KEY NOT NULL, 
    username VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL);
  -  CREATE TABLE tasks(
     id BIGSERIAL PRIMARY KEY NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     isComplete BOOLEAN DEFAULT FALSE,
     userId INTEGER REFERENCES users(id) ON DELETE SET NULL);

### 2. Backend

- **Install Dependencies**:  
  - cd backend
  - npm install
  - npm i -D nodemon 
  - npm i express dotenv pg bcrypt jsonwebtoken
- **Start Backend Server**:  
  - npm run dev
- **Notes**:  
  - Remeber to modify DB and Port settings in .env file with respect to your device

### 3. Frontend
- **Install Dependencies**:  
  - cd frontend
  - npm install
  - npm install axios react-router-dom jwt-decode
- **Start Frontend Server**:  
  - npm run dev
- **Notes**:  
  - Remeber to modify VITE_API_URL settings in .env file with respect to your device's backend server port

### 4. Salary Expectations Per Month
- **5k to 8k per month**

### 5. Video Demo
- **[Video Demo](https://www.youtube.com/watch?v=E8-vRE9ZVy4)**