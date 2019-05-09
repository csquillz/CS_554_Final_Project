import React from "react";
import io from "socket.io-client";
let socket = io("http://localhost:4000");

class Chat extends React.Component {

    constructor(props) {
        super(props);
        const username = prompt("Enter a username: ")
        this.state = {
            input: "",
            roomInput: "",
            username,
            messages: [`${username} has joined the chat!`],
            roomName: "CS554",
            rooms: ["CS443", "General"]
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.addRoom = this.addRoom.bind(this);

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

    async addRoom(event) {
        event.preventDefault();
        let newRoom = this.state.roomInput
        await this.setState({ rooms: [...this.state.rooms, newRoom] })
        console.log(this.state.roomInput)
        console.log(this.state.rooms)
        this.setState({ roomInput: "" });
    }

    async handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleRoomChange(event) {
        let prevRoom = this.state.roomName
        let currRoom = event.target.value
        await this.setState({ roomName: currRoom });

        socket.emit("join_room", {
            username: this.state.username,
            prevRoom: prevRoom,
            currRoom: currRoom
        });

        // console.log(currRoom)
        // console.log(this.state.roomName)
        let emptyArr = []
        this.setState({ messages: emptyArr });
        // console.log(this.state.messages)
    }

    async handleSubmit(event) {
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
                <div>
                    <h1 className="chatTitle">{this.state.roomName}</h1>
                    <form className="addChatRoom" onSubmit={this.addRoom}>
                        <input type="text" value={this.state.roomInput} name="roomInput" onChange={this.handleChange} />
                        <button type="submit" value="Submit">Add Room!</button>
                    </form>
                </div>
                <ul className="messages">
                    {this.state.messages.map(item => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <form onSubmit={this.handleSubmit}>
                    <select id="room-selector" onChange={this.handleRoomChange}>
                        {this.state.rooms.map((i) =>
                            <option name= "roomName" key={i} value={i}>{i}</option>
                        )}
                    </select>
                    <input type="text" value={this.state.input} name="input" onChange={this.handleChange} />
                    <button type="submit" value="Submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Chat;