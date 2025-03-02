# Not so simple Chat App

Welcome to the Not so simple Chat App! This is a real-time chat application built with modern web technologies. Feel free to visit and check the website at [front.nasiadka.pl](https://front.nasiadka.pl/)

| Chat Screen | Login Page | Contacts |
| - | - | - |
| ![](https://nasiadka.pl/projects/SimpleChat/chat.png) | ![](https://nasiadka.pl/projects/SimpleChat/login.png) | ![](https://nasiadka.pl/projects/SimpleChat/contacts.png) |

## Features

- User authentication (signup, login, logout) with email verification
- Real-time messaging with image, links and emoticons support
- Friends system with online status tracking
- Message search and chat history
- Profile customization with avatar colors and about section
- Theme customization
- Secure password hashing and cookie authentication
- Responsive design for mobile and desktop
- Advanced systems of error handling


### Frontend
Built with React and Vite, featuring:

| Technology        | Usage                                            |
|-------------------|--------------------------------------------------|
| **React 18**      | Modern UI development with hooks and components  |
| **Vite**          | Next-generation frontend tooling                 |
| **Zustand**       | Simple and scalable state management             |
| **React Router**  | Client-side routing and navigation               |
| **Axios**         | HTTP client for API requests                     |
| **Socket.io**     | Real-time bidirectional communication            |
| **TailwindCSS**   | Utility-first CSS framework                      |
| **DaisyUI**       | Component library for Tailwind                   |
| **Lucide**        | Modern icon library                              |

## Backend

The backend is built with Node.js, Express, and MongoDB.

| Libraries          | Description                                       |
|--------------------|---------------------------------------------------|
| **Express**        | A web application framework for Node.js.          |
| **Mongoose**       | A library for MongoDB and Node.js.                |
| **JWT (jsonwebtoken)** | For generating and verifying JSON Web Tokens. |
| **Bcryptjs**       | For hashing passwords.                            |
| **Socket.io**      | For real-time communication.                      |
| **Cors**           | For enabling Cross-Origin Resource Sharing.       |
| **Cookie-Parser**  | For parsing cookies.                              |
| **Dotenv**         | For loading environment variables from a `.env` file. |


## Build Instructions

### Frontend

To build the frontend, navigate to the `frontend` directory and run the following command:

```sh
npm run build
```

Built website will be in folder "dist"


### Backend

To start the backend server, navigate to the `backend` directory and run the following command:

```sh
node index.js
```