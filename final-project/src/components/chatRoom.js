import React from "react";
import io from "socket.io-client";
let socket = io("http://localhost:4000");

class Chat extends React.Component {

    constructor(props) {
        super(props);
        const username = prompt("Enter a username: ")
        this.state = {
            input: "",
            username,
            messages: [`${username} has joined the chat!`],
            roomName: "CS554"
        };


        // console.log(this.state.username)bob

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);

    }

    componentDidMount() {
        //this.setState({ messages: ["You have joined the chat as '" + this.state.username + "'."] })

        const addMessage = this.addMessage
        socket.on("chat_message", (data) => {
            addMessage(data.username + ": " + data.message);
        });
        socket.on("user_join", (data) => {
            addMessage(data.username + " just joined the chat!");
        });
        socket.on("user_leave", function (data) {
            addMessage(data + " has left the chat.");
        });

        socket.emit("user_join", {
            username: this.state.username,
            roomName: this.state.roomName
        });
    }

    addMessage = (message) => {
        // console.log(message)
        this.setState({ messages: [...this.state.messages, message] })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleRoomChange(event) {
        let prevRoom = this.state.roomName
        let currRoom = event.target.value
        this.setState({ roomName: currRoom });
        
        socket.emit("join_room", {
            username: this.state.username,
            prevRoom: prevRoom,
            currRoom: currRoom
        });

        // console.log(currRoom)
        // console.log(this.state.roomName)
        let emptyArr = []
        this.setState({messages: emptyArr});
        // console.log(this.state.messages)
    }

    handleSubmit(event) {
        event.preventDefault();
        this.addMessage(this.state.username + ": " + this.state.input);
        socket.emit("chat_message", {
            roomName: this.state.roomName,
            username: this.state.username,
            message: this.state.input
        });
        this.setState({ input: "" });
    }

    render() {
        return (
            <div>
                <div>{this.state.roomName}</div>
                <ul class="messages">
                    {this.state.messages.map(item => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <form onSubmit={this.handleSubmit}>
                    <select id="room-selector" onChange={this.handleRoomChange}>
                        <option name= "roomName" value="CS554" >CS 554</option>
                        <option name= "roomName" value="general">General</option>
                        <option name= "roomName" value="trains">Trains</option>
                    </select>
                    <input type="text" value={this.state.input} name="input" onChange={this.handleChange} />
                    <button type="submit" value="Submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Chat;