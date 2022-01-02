import { createContext, useContext, useEffect, useState } from "react";
import contacts from "data/contacts";
import { useSocketContext } from "./SocketContext";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import {v4 as uuid4} from "uuid"
import parseMessages from "utils/parseMessages"
import Axios from "axios";


const UsersContext = createContext();

const useUsersContext = () => useContext(UsersContext);

const UsersProvider = ({ children }) => {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const [newChat, setnewChat] = useState(null)
	const socket = useSocketContext();

	const [users, setUsers] = useState(contacts);

	const _updateUserProp = (userId, prop, value) => {
		setUsers((users) => {
			const usersCopy = [...users];
			let userIndex = users.findIndex((user) => user.id === userId);
			const userObject = usersCopy[userIndex];
			usersCopy[userIndex] = { ...userObject, [prop]: value };
			return usersCopy;
		});
	};

	const setUserAsTyping = (data) => {
		const { userId } = data;
		_updateUserProp(userId, "typing", true);
	};

	const setUserAsNotTyping = (data) => {
		const { userId } = data;
		_updateUserProp(userId, "typing", false);
	};

	const fetchMessageResponse = (data) => {
		setUsers((users) => {
			const { userId, response } = data;

			let userIndex = users.findIndex((user) => user.id === userId);
			const usersCopy = JSON.parse(JSON.stringify(users));
			const newMsgObject = {
				content: response,
				sender: userId,
				time: new Date().toLocaleTimeString(),
				status: null,
			};

			usersCopy[userIndex].messages.TODAY.push(newMsgObject);

			return usersCopy;
		});
	};

	// useEffect(() => {
	// 	socket.on("fetch_response", fetchMessageResponse);
	// 	socket.on("start_typing", setUserAsTyping);
	// 	socket.on("stop_typing", setUserAsNotTyping);
	// }, [socket]);

	const setUserAsUnread = (userId) => {
		_updateUserProp(userId, "unread", 0);
	};

	async function updateReadChat(body) {
		try {
			const res = await Axios.patch("chat-read", {...body})
		}
		catch (err){
			console.error("Chat read error in backend")
		}
	}

	const chatRead = (userId) => {
		appDispatch({type: "setIChatRead", data: {chat_with_id: userId}})
		socket.emit("chat_read", {reader: appState.user.id, chat_with: userId})
		updateReadChat({reader: appState.user.id, chat_with: userId})
	};

	const addNewMessage2 = (userId, message) => {
		let userIndex = users.findIndex((user) => user.id === userId);
		const usersCopy = [...users];
		const newMsgObject = {
			content: message,
			sender: null,
			time: new Date().toLocaleTimeString(),
			status: "delivered",
		};

		usersCopy[userIndex].messages.TODAY.push(newMsgObject);
		setUsers(usersCopy);

		// socket.emit("fetch_response", { userId });
	};

	async function updateNewMessage(newMsgObject) {
		try {
			const res = await Axios.patch("new-message", {newMsgObject})
		}
		catch (err){
			console.error("New message error in backend")
		}
	}

	const addNewMessage = (chat_with_id, message) => {
		// console.log(chat_with_id)
		// let chatIndex2 = appState.chats.filter((chat) => Number(chat.chat_with.id) === 8);
		// console.log(chatIndex2, "gfvh")
		let chatIndex = appState.chats.findIndex((chat) => Number(chat.chat_with.id) === Number(chat_with_id));
		// const chatsCopy = [...appState.chats];
		const chatsCopy = JSON.parse(JSON.stringify(appState.chats))
		const newMsgObject = {
			uid: uuid4(),
			content: message,
			sender: {id: appState.user.id, profile_picture: appState.user.profile_picture,
					 phone: appState.user.phone},
			sent_for: chatsCopy[chatIndex].chat_with.id,
			time: new Date().toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'}).split(" ")[0],
			date: new Date().toLocaleDateString('en-IN', {timeZone: 'Asia/Kolkata'}).split("/"),
			status: "sent",
		};
		newMsgObject.date = newMsgObject.date[2]+"-"+newMsgObject.date[1]+"-"+newMsgObject.date[0]
		const msgCopy = {...newMsgObject, sender: appState.user.id}
		// console.log(newMsgObject)
		// if(chatsCopy[chatIndex].messages.TODAY)
		// 	chatsCopy[chatIndex].messages.TODAY.push(newMsgObject);
		// else
		// 	chatsCopy[chatIndex].messages[new Date().toLocaleDateString()] = [newMsgObject]
		// appDispatch({type: "addChats", data: chatsCopy})
		appDispatch({type: "addMessage", data: {message: msgCopy, chat_with_id: chat_with_id}})

		socket.emit("send_message", { newMsgObject, dfg: "chatId" });
		updateNewMessage(newMsgObject)
	};

	function shg() {
		console.log(appState)
	}

	function handleIncomingMessage21 (message) {
		// let chatIndex2 = appState.chats.filter((chat) => Number(chat.chat_with.id) === 8);
		// console.log(chatIndex2, "gfvh")
		// shg()
		// console.log(appState, "puiiii")
		// appState.chats.forEach(element => {
		// 	console.log(element.chat_with.id, "ghj")
		// });

		let chat = appState.chats.filter(chat => Number(chat.chat_with.id) === Number(message.sender.id))[0]
		// console.log(chat, "hello", message)
		if(!chat) {
			const newChatObject = {
				id: uuid4(),
				phone: message.sender.phone,
				unread: 1,
				chat_with: message.sender,
				messages: parseMessages([{...message, sender: message.sender.id}])
			}
			appDispatch({type: "addChat", data: newChatObject})
			return
		}
		appDispatch({type: "addMessage", data: {message: {...message, sender:message.sender.id}, chat_with_id: chat.chat_with.id}})
	}

	function handleIncomingMessage (message) {
		const newChatObject = {
			id: uuid4(),
			phone: message.sender.phone,
			unread: 1,
			chat_with: message.sender,
			messages: parseMessages([{...message, sender: message.sender.id}])
			}
		appDispatch({type: "addMessage", data: {message: {...message, sender:message.sender.id}, new_chat: newChatObject, chat_with_id: newChatObject.chat_with.id}})
	}

	useEffect(()=>{
		socket.on('incoming_message', function(msg) {
			console.log("incoming  message")
			handleIncomingMessage(msg)
			})
		socket.on('chat_read', function(msg) {
			appDispatch({type: "setOChatRead", data: {chat_with_id: msg["reader"]}})
			})
		socket.on('incoming_call', function(msg) {
			appDispatch({type: "callFrom", data: msg})
			})
	}, [])

	return (
		<UsersContext.Provider value={{ users, setUserAsUnread, addNewMessage, chatRead }}>
			{children}
		</UsersContext.Provider>
	);
};

export { useUsersContext, UsersProvider };
