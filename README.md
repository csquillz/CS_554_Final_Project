# CS_554_Final_Project

## Summary

**Class Helper** is a chat room that can be used during class to discuss topics mentioned by the professor and ask any questions about topics discussed. There is also a pdf viewer that allows you to upload course material and save comments on each page to be viewed later.
 
## How to Run
- Clone the repository
- Open a command window and  run the command "npm run seed" to add information to the database
- After that is complete, run the command "redis-server" in another window to start the redis server
- After that is complete, run the command "npm run electron-dev" in another window to start the MongoDB and socket.io servers and app servers in electron
- Navigate to "http://localhost:3000/" in your browser
- Sign up using the login feature
- You should now be redirected to the chat part of the application
- You can also access the pdf part of the application by clicking on the "documents" section in the navigation bar

## How to Use
-You can join one of our chat rooms to interact with other students and discuss any problems or solution of the class by clicking on "Chatroom:. There are many separate rooms you can choose according to the courses. You can also create your own room which other students can join for chatting.
-Also, you can working PDF documents by clikcing on "Documents" in the navigation bar and uploading the PDF you want to work on. Make comments on the pages for your reference and save each page to be viewd at a later time. This makes it easier to make notes while studying! To view the previously saved comments, you can simply reload the PDF you made the comments on!
-You can also update your Account password by visiting the "MyAccount" page from the navigation bar

## Technologies

**Tech Stack:**
- React
- HTML
- CSS
- Javascript
- Axios
- JSON
- Electron/Photon
- Firebase
- MongoDB
- Socket.io
- React-PDF
- Redis
