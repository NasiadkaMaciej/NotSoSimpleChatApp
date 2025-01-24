# Not so simple Chat App

Welcome to the Not so simple Chat App! This is a real-time chat application built with Node.js, Express, MongoDB, and Socket.io. Feel free to to visit and check the website! [front.nasiadka.pl](https://front.nasiadka.pl/)

## Features

- User authentication (signup, login, logout, checkAuth)
- Real-time messaging with Socket.io
- Secure password hashing with bcrypt
- JWT-based authentication
- MongoDB for data storage

## Frontend

The frontend is built with React and Vite.

| Libraries          | Description                                      |
|--------------------|--------------------------------------------------|
| **React**          | A JavaScript library for building user interfaces. |
| **React Router**   | For handling routing in the application.         |
| **Zustand**        | For state management.                            |
| **Axios**          | For making HTTP requests.                        |
| **Tailwind CSS**   | For styling the application.                     |
| **DaisyUI**        | A Tailwind CSS component library.                |
| **React Hot Toast**| For displaying toast notifications.              |
| **Lucide React**   | For icons.                                       |

## Backend

The backend is built with Node.js, Express, and MongoDB.

| Libraries          | Description                                      |
|--------------------|--------------------------------------------------|
| **Express**        | A web application framework for Node.js.         |
| **Mongoose**       | An ODM (Object Data Modeling) library for MongoDB and Node.js. |
| **JWT (jsonwebtoken)** | For generating and verifying JSON Web Tokens. |
| **Bcryptjs**       | For hashing passwords.                           |
| **Socket.io**      | For real-time communication.                     |
| **Cors**           | For enabling Cross-Origin Resource Sharing.      |
| **Cookie-Parser**  | For parsing cookies.                             |
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