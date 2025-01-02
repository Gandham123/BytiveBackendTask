Here is an updated **README.md** file tailored to the code you provided:

---

# **To-Do List API**

## **Project Description**

This project is a RESTful API service for managing a simple to-do list application with user authentication using JWT. It supports creating, fetching, updating, and deleting tasks. The SQLite database is used for data persistence.

---

## **Features**

1. **User Authentication**:
   - **Register**: Create an account with a unique username and password.
   - **Login**: Authenticate and receive a JWT token to access the API.

2. **Task Management**:
   - **Create Task**: Add a new task with a title and description.
   - **Fetch All Tasks**: Retrieve all tasks from the database.
   - **Fetch Task by ID**: Get a specific task using its ID.
   - **Update Task Status**: Modify the status of a task.
   - **Delete Task**: Remove a task using its ID.

---

## **Prerequisites**

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [Postman](https://www.postman.com/) or any API testing tool
- SQLite (bundled with Node.js SQLite package)

---

## **How to Run the Project**

### **1. Clone the Repository**
```bash
git clone <repository_url>
cd todo-api
```

### **2. Install Dependencies**
Run the following command to install all required Node.js packages:
```bash
npm install
```

### **3. Set Up Environment**
Ensure the following dependencies are installed:
- **SQLite**: The database file `TodoApllication.db` will be used.

### **4. Start the Server**
Run the server:
```bash
node index.js
```
The server will start at `http://localhost:3000`.

---

## **API Endpoints**

### **Authentication**
1. **Register**:  
   - **POST** `/register`  
   - Body:  
     ```json
     {
       "id": "1",
       "name": "example",
       "password": "example123"
     }
     ```  
   - Response: `User registered successfully` or error message.

2. **Login**:  
   - **POST** `/login`  
   - Body:  
     ```json
     {
       "name": "example",
       "password": "example123"
     }
     ```  
   - Response:  
     ```json
     {
       "token": "your_jwt_token"
     }
     ```

### **Task Management**  
(All endpoints require a valid JWT in the `Authorization` header as `Bearer <token>`.)

1. **Create Task**:  
   - **POST** `/tasks`  
   - Body:  
     ```json
     {
       "id": "1",
       "title": "Task Title",
       "discription": "Task Description"
     }
     ```  
   - Response: `Task Posted Successfully`.

2. **Fetch All Tasks**:  
   - **GET** `/tasks`  
   - Response:  
     ```json
     {
       "data": [
         {
           "id": "1",
           "title": "Task Title",
           "discription": "Task Description",
           "status": "pending"
         }
       ]
     }
     ```

3. **Fetch Task by ID**:  
   - **GET** `/tasks/:id`  
   - Response: Task details or error message.

4. **Update Task Status**:  
   - **PUT** `/tasks/:id`  
   - Body:  
     ```json
     {
       "status": "in-progress"
     }
     ```  
   - Response: `Status updated successfully`.

5. **Delete Task**:  
   - **DELETE** `/tasks/:id`  
   - Response: `Task deleted from database`.

---

## **Testing the API**

1. **Register a User**: Use the `/register` endpoint to create an account.
2. **Login**: Authenticate using the `/login` endpoint to receive a JWT token.
3. **Test Task Management Endpoints**: Use the JWT token in the `Authorization` header for all task management endpoints.

---

## **Project Structure**

```
todo-api/
│
├── index.js              # Main server file
├── TodoApllication.db  # SQLite database file
├── TodoApllication.sql # to create tasks table
├── user.sql            # to create table for userdetails 
├── README.md           # Instructions to run the project
├── package.json        # Dependencies and scripts
├── .env                # Environment variables (optional)
```

---

## **Notes**

- Always include the JWT token in the `Authorization` header when accessing protected endpoints.  
  Example:  
  `Authorization: Bearer <your_jwt_token>`
- Ensure the database file `TodoApllication.db` is in the project root directory.
- Use `Postman` or any API testing tool to test the endpoints.

--- 

This README should serve as a complete guide for running and testing your project.
