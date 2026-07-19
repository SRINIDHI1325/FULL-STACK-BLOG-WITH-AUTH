# 📝 Full Stack Blog Application with Authentication

A modern full-stack blogging platform built with **React.js, Tailwind CSS, Spring Boot, Spring Security, JWT Authentication, and MySQL**. Users can register, log in securely, create and manage blog posts, and interact with content through a clean and responsive interface.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Secure password encryption
* Role-based access control
* Protected routes
* Persistent login sessions

### ✍️ Blog Management

* Create new blog posts
* View all published posts
* View individual post details
* Edit existing posts
* Delete posts
* User-specific post management

### 👤 User Features

* User profile management
* Personalized dashboard
* View created posts
* Secure logout

### 🎨 Frontend Features

* Modern responsive UI
* React component-based architecture
* Tailwind CSS styling
* React Router navigation
* API integration with backend
* Loading and error handling

### ⚙️ Backend Features

* RESTful APIs
* Spring Boot architecture
* Spring Security configuration
* JWT token validation
* JPA/Hibernate database integration
* MySQL database support

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* Vite

## Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Hibernate / JPA
* Maven

## Database

* MySQL

## Tools

* Git & GitHub
* VS Code
* IntelliJ IDEA
* Postman

---

# 📂 Project Structure

```
FULL-STACK-BLOG-WITH-AUTH

│
├── backend
│   └── demo
│       ├── src
│       │   └── main
│       │       ├── java
│       │       └── resources
│       ├── pom.xml
│       └── application.properties
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/SRINIDHI1325/FULL-STACK-BLOG-WITH-AUTH.git
```

Navigate into the project:

```bash
cd FULL-STACK-BLOG-WITH-AUTH
```

---

# 🔧 Backend Setup (Spring Boot)

Go to backend folder:

```bash
cd backend/demo
```

Configure database in:

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/blogdb
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

Run backend:

Windows:

```bash
mvnw spring-boot:run
bash run-backend.sh
```
```powershell

cd backend/demo
.\run-backend.ps1
```

or:

```bash
./mvnw spring-boot:run
```

Backend runs on:

```
http://localhost:8082
```

---

# 🌐 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create `.env` files locally.

Frontend:

```
frontend/.env
```

Backend:

```
backend/demo/.env
```

Do not upload `.env` files to GitHub.

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |

## Blog Posts

| Method | Endpoint          | Description   |
| ------ | ----------------- | ------------- |
| GET    | `/api/posts`      | Get all posts |
| GET    | `/api/posts/{id}` | Get post      |
| POST   | `/api/posts`      | Create post   |
| PUT    | `/api/posts/{id}` | Update post   |
| DELETE | `/api/posts/{id}` | Delete post   |

---

# 📸 Screenshots

(Add application screenshots here)

---

# 🔮 Future Improvements

* Add comments system
* Add likes and bookmarks
* Add image upload support
* Add search functionality
* Add categories and tags
* Deploy frontend and backend using cloud services

---

# 👩‍💻 Author

**S Srinidhi**

B.Tech Computer Science (Information Technology)

GitHub:
https://github.com/SRINIDHI1325

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
