import React from "react";
import io from "socket.io-client";
import axios from "axios";
import firebase from 'firebase';
import { withAuthorization } from '../components/Session';

let socket = io("http://localhost:4000");

class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            input: "",
            roomInput: "",
            username: "",
            messages: [`You have joined the chat!`],
            roomName: "",
            rooms: [],
            users: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);
        this.addRoom = this.addRoom.bind(this);
        this.addMessage = this.addMessage.bind(this);
        firebase.auth().onAuthStateChanged(this.onAuthChage.bind(this));
    }

    onAuthChage(user) {
        let username = ""
        if (user.displayName) {
            username = user.displayName
        }
        else {
            username = user.email
            username = username.substring(0, username.indexOf('@'));
        }
        this.setState({ username: username })

    }

    async componentDidMount() {
        // this.setState({ messages: ["You have joined the chat as '" + this.state.username + "'."] })
        await firebase.auth().onAuthStateChanged(this.onAuthChage.bind(this));

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

        // socket.emit("join_room", {
        //     username: this.state.username,
        //     prevRoom: this.state.roomName,
        //     currRoom: this.state.roomName
        // });

        let roomInfo = await axios.get("http://localhost:5000/api/chatrooms/")
            .then(data => data.data)
            .then(res => res);

        await this.setState({ rooms: roomInfo })
        await this.setState({ roomName: roomInfo[0].chatroomName })

        socket.emit("user_join", {
            username: this.state.username,
            roomName: this.state.roomName
        });
    }

    addMessage(message) {

        this.setState({ messages: [...this.state.messages, message] })
    }

    addtoRedis(message) {

        axios.post("http://localhost:5000/api/chatrooms/messages", {
            message: message,
            chatroomName: this.state.roomName
        }).then(data => data.data)
    }

    async addRoom(event) {

        event.preventDefault();
        let newRoom = this.state.roomInput
        this.setState({ roomInput: "" });

        await axios.post("http://localhost:5000/api/chatrooms/", {
            chatroomName: newRoom
        }).then(data => data.data)
            .then(res => res != false? this.setState({ rooms: [...this.state.rooms, res] }): console.log(res ));
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

        // this.addMessage(this.state.username + " just joined the chat!");

        await this.setState({
            messages: await axios.get("http://localhost:5000/api/chatrooms/messages/" + currRoom)
                .then(data => data.data)
                .then(res => res)
        });
    }

    async handleSubmit(event) {

        event.preventDefault();
        this.addMessage(this.state.username + ": " + this.state.input);
        this.addtoRedis(this.state.username + ": " + this.state.input)
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
                <header className="toolbar toolbar-header">
                    <div className="toolbar-actions">
                        <h1 className="chatTitle" style={{ "margin": "0.2rem" }}>{this.state.roomName === "" ? "-" : this.state.roomName}</h1>
                        <form className="addChatRoom" onSubmit={this.addRoom}>
                            <input type="text" value={this.state.roomInput} style={{ "float": "left" }} name="roomInput" onChange={this.handleChange} />
                            <div style={{ "overflow": "hidden", "padding-left": ".2em", "padding-right": ".2em" }}>
                                <button className="btn btn-default" type="submit" style={{ "width": "100%" }}>Add a Room!</button>
                            </div>
                        </form>
                    </div>
                </header>

                <div className="chatRoom">
                    <div className="messagesList">
                        <ul className="messages">
                            {this.state.messages.map(item => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="chatDiv">
                        <form className="chatbox" onSubmit={this.handleSubmit}>

                            <select className="form-control dropdown" id="room-selector" onChange={this.handleRoomChange}>
                                {this.state.rooms.map((i) =>
                                    <option name="roomName" key={i.chatroomName} value={i.chatroomName}>{i.chatroomName}</option>
                                )}
                            </select>
                            <input className="form-control" type="text" value={this.state.input} placeholder="Enter your message here." name="input" onChange={this.handleChange} />
                            <button className="btn btn-default" type="submit" value="Submit">
                                <span className="icon icon-rocket icon-text"></span>
                                Submit
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Chat);