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
            messages: [`${username} has joined the chat!`]
        };

        
        // console.log(this.state.username)bob

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    componentDidMount(){
        //this.setState({ messages: ["You have joined the chat as '" + this.state.username + "'."] })
        
        const addMessage = this.addMessage
        socket.on("chat_message", (data) => {
            console.log(data)
            addMessage(data.username + ": " + data.message);
        });
        socket.on("user_join", (data) => {
            console.log("join data:", data)
            addMessage(data + " just joined the chat!");
        });
        socket.on("user_leave", function (data){
            console.log(data)
            addMessage(data + " has left the chat.");
        });
        
        console.log(this.state.username)
        socket.emit("user_join", this.state.username);
    }

    addMessage = (message) => {
        console.log(message)
        this.setState({messages: [...this.state.messages, message] })
        
        // console.log(messages)
        // const li = document.createElement("li");
        // li.innerHTML = message;
        // messages.appendChild(li);
        // window.scrollTo(0, document.body.scrollHeight);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.addMessage(this.state.username + ": " + this.state.input);
        socket.emit("chat_message", {
            username: this.state.username,
            message: this.state.input
        });
        this.setState({ input: "" });
    }

    render() {
        return (
            <div>
                <ul class="messages">
                    {this.state.messages.map(item => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.input} name="input" onChange={this.handleChange} />
                    <button type="submit" value="Submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default Chat;