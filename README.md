# 🚤 BoatBook App

BoatBook is a full-stack web application designed to expose a collection of boats, accessible only to registred and autheticated users. It features a modern Angular frontend and a secure Spring Boot backend, both containerized with Docker for simplified deployment and development.

 ---

# 📚 Features

🧾 Expose, register, update and manage boats

👤 Registration and login with email and password and Read only profile access

🔐 Authenticated and Role-based secure access

🌍 Internationalization support (EN/FR)

🐳 Fully containerized for portability

---

## 🛠 Technologies Used

- **Frontend**: Angular 19, Tailwind css, Font Awesome, nz-oorro Library
- **Backend**: Spring Boot 3.5.0 (Java 21)
- **Authentication**: JWT
- **Database**: H2 (in-memory, with Flyway migrations)
- **Build**: Maven, NPM
- **Containerization**: Docker, Docker Compose

---

## 📦 Project Structure and accessibility

Boat/
├── docker-compose.yml # Docker orchestration file
├── server/ # Spring Boot backend application
│ └── Dockerfile
├── client/ # Angular frontend application
│ └── Dockerfile



Access Urls

| Service     | URL                                            |
| ----------- | ---------------------------------------------- |
| Frontend    | [http://localhost:4200](http://localhost:4200) |
| Backend API | [http://localhost:8080](http://localhost:8080) |

For local development, it uses a proxy to avoid CORS browser blocking and Ngnix in Docker environment.

## ⚡️ Run Locally and Tests

Backend (Spring Boot)

- cd server
- ./mvnw clean install
- ./mvnw spring-boot:run   --> run on port 8080 
For Tests

- ./mvnw clean test

Frontend (Angular)

- cd client
- npm install
- ng serve --> run on port 4200



## 🚀 Run with Docker

### Prerequisites

- Docker & Docker Compose installed on your machine.
- Backend cd server then ./mvnw clean package
- Frontend cd client then npm run build -- --configuration=production

### Build and Run

From the root of the project, run in the following command in terminal:

- docker-compose up --build

Or 

- docker compose up --build for MacOS 

---

## 🔐 Authentication and Persmission

After registration using email password, the front send a header for Authentication and Authorization using JWT token. 
The token is sent in the header of the request as follows:
Authorization: Bearer <jwt-token>

- User with ROLE_USER can register, login, create boats and delete their own boats.
- User with ROLE_ADMINcan register, login, create boats and delete their own boats and others boats.


## 🌍 Internationalization

The Frontend uses ngx-translate for internationalization. The application supports English (en) and French (fr) languages. It detect browser language else it uses English by default. The language can be changed by clicking on the flag icon in the top right corner of the screen. HttpTranslateLoader is configure to combine translates files from backend and locally in the frontend. Backend keys override local if duplicated.


- 👤 Author
- Ahmed Hachmi
- Full Stack Java Developer
- GitHub: [hachmi-ahmed](https://github.com/hachmi-ahmed)

