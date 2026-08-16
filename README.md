# 🧠 Mind-Games

A comprehensive, interactive web-based gaming hub developed as a college project by students of **New L.J. Institute of Engineering and Technology**. 

This application features a collection of classic and educational mind games designed to stimulate cognitive skills, memory, and logical thinking, all integrated into a unified portal with user authentication and profile management.

---

## 👥 Contributors (Team Members)
This project was designed, developed, and maintained by:
* **Barthna**
* **Kushagra**
* **Devanshu**

---

## 🎮 Games Included

The platform contains a wide variety of puzzle and logic games, including:
1. **Tic-Tac-Toe** - Classic 2-player board game.
2. **Sudoku** - Number placement puzzle requiring logic and pattern matching.
3. **Word Search** - Grid-based word finding game to boost vocabulary.
4. **Sliding Puzzle** - Image/number block sliding puzzle to test spatial reasoning.
5. **Crossword** - Clue-based word puzzle game.
6. **Hangman** - Word guessing game with visual feedback.
7. **Matching Cards** - Find matching pairs of cards.
8. **Memory Game** - Grid-based game to test and improve short-term memory.
9. **Maze Game** - Navigate through custom paths to reach the target.
10. **Math Puzzle** - Numerical brain teasers.

---

## 🛠️ Tech Stack

### Frontend
* **HTML5** & **CSS3** - Semantic structure and fully custom modern UI styling.
* **Vanilla JavaScript (ES6+)** - Game logic, DOM manipulation, dynamic interactions, and API communication.

### Backend
* **Node.js** & **Express.js** - Server-side architecture and RESTful API endpoints.
* **JWT (JSON Web Tokens)** - Secure stateless user authentication.
* **BcryptJS** - Password hashing for secure user data storage.
* **Mongoose & MongoDB** - Schema-based modeling and NoSQL database to store user credentials, profiles, and submissions.
* **Multer** - Middleware for handling file uploads (e.g., profile picture/avatar updates).
* **Helmet & Express Rate Limit** - Security middleware to protect the application.

---

## ⚙️ Project Setup & Installation

Follow these steps to run the project locally on your machine:

### Prerequisites
* [Node.js](https://nodejs.org/) installed.
* [MongoDB](https://www.mongodb.com/) installed and running locally, or a MongoDB Atlas URI.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Mind-Games/Mind-Games
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `Mind-Games` directory and define the following variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/UserData
JWT_SECRET=your_jwt_secret_here
```

### 4. Run the Application
Start the Node.js server:
```bash
npm start
```
The server will start, and the frontend can be accessed via `http://localhost:5000` (or the port defined in your `.env`).

---

## 🎓 College Details
* **Institute:** New L.J. Institute of Engineering and Technology
* **Project Type:** College Semester Project
