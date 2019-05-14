# CS_554_Final_Project

## Summary

**Class Helper** is a chat room that can be used during class to discuss topics mentioned by the professor and ask any questions about topics discussed. There is also a pdf viewer that allows you to upload course material and save comments on each page to be viewed later.
 
## How to Run
- Clone the repository
- Open a command window and  run the command "npm run seed" to add information to the database
- After that is complete, run the command "npm startServers" to start the MongoDB and socket.io servers
- After that is complete, run the command "redis-server" in another window to start the redis server
- After that is complete, run the command "npm start" to start the server
- Navigate to "http://localhost:3000/" in your browser
- Sign up using the login feature
- You should now be redirected to the chat part of the application
- You can also access the pdf part of the application by clicking on the "documents" section in the navigation bar

## How to Use
- Add a goal by clicking "Add Goal" and enter the category, amount, and month
- Remove a goal by clicking the "Remove Goal" button under the desired goal
- Add a transaction by clicking "Add Transaction: and enter type, store, amount, and date, and description
- Remove a goal by clicking the "Remove Goal" button next to the desired transaction
- View charts for the current month by clicking "View Charts"
- Go back to the home page from the charts by clicking the title "Budget Tracker"
- Logout by clicking "Logout" in the top right corner

## Technologies

**Tech Stack:**
- HTML
- CSS
- Javascript
- React
- AJAX
- JSON
- Electron
- Firebase
- MongoDB
- Socket.io
- React-PDF
- Redis

