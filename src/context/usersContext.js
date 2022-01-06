import { createContext, useContext, useEffect, useRef, useState } from "react";
import contacts from "data/contacts";
import { useSocketContext } from "./SocketContext";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import {v4 as uuid4} from "uuid"
import parseMessages from "utils/parseMessages"
import Axios from "axios";
import messageTune from "./message.mp3"
import callTune from "./call.mp3"

const UsersContext = createContext();

const useUsersContext = () => useContext(UsersContext);

const UsersProvider = ({ children }) => {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	// const [newChat, setnewChat] = useState(null)
	const socket = useSocketContext();
	const messageAudio = new Audio(messageTune)
	const callAudioRef = useRef()
	messageAudio.hidden = true

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

	const setUserAsUnread = (userId) => {
		_updateUserProp(userId, "unread", 0);
	};

	async function updateReadChat(body) {
		try {
			await Axios.patch("chat-read", {...body})
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

	async function updateNewMessage(newMsgObject) {
		try {
			await Axios.post("new-message", {newMsgObject})
		}
		catch (err){
			console.error("New message error in backend")
		}
	}

	const addNewMessage = (chat_with_id, message) => {
		let chatIndex = appState.chats.findIndex((chat) => Number(chat.chat_with.id) === Number(chat_with_id));
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

		appDispatch({type: "addMessage", data: {message: msgCopy, chat_with_id: chat_with_id}})

		socket.emit("send_message", { newMsgObject, dfg: "chatId" });
		updateNewMessage(newMsgObject)
	};

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

	function handleMessageTune() {
		messageAudio.currentTime = 0
		messageAudio.play()
	}

	function handleCallTune() {
		callAudioRef.current.currentTime = 0
		callAudioRef.current.play()
	}

	function stopCallRing() {
		callAudioRef.current.pause()
	}

	useEffect(()=>{
		socket.on('incoming_message', function(msg) {
			// console.log("incoming  message")
			handleMessageTune()
			handleIncomingMessage(msg)
			})
		socket.on('chat_read', function(msg) {
			appDispatch({type: "setOChatRead", data: {chat_with_id: msg["reader"]}})
			})
		socket.on('incoming_call', function(msg) {
			handleCallTune()
			appDispatch({type: "callFrom", data: msg})
			})
	// eslint-disable-next-line
	}, [])

	return (
		<UsersContext.Provider value={{ users, setUserAsUnread, addNewMessage, chatRead, stopCallRing }}>
			<audio hidden src={callTune} ref={callAudioRef}></audio>
			{children}
		</UsersContext.Provider>
	);
};

export { useUsersContext, UsersProvider };
