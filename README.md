# How to run this app

## MongoDB Configuration

Create a free database cluster and user on MongoDB Cloud. Generate a password for that user and replace the MongoDB password in the folder `./backend-express-server.js`. 
Make sure your DB URL is correct as well which can be found in the MongoDB connect setting.

First run the following to install dependencies:
### npm install

## Express Backend

To run the express backend, run
### npm run start:server

The console will say `Database connected!` if you configured the above properly.

To access your Express server, visit http://localhost:4200/posts on your browser!

## React Frontend

To run the React frontend, run 
### npm run start:ui

To access your React app, visit http://localhost:3000/ on your browser!

These scripts can be found in the `package.json`.

