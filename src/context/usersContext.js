import { createContext, useContext, useEffect, useState } from "react";
import contacts from "data/contacts";
import { useSocketContext } from "./SocketContext";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import {v4 as uuid4} from "uuid"

const UsersContext = createContext();

const useUsersContext = () => useContext(UsersContext);

const UsersProvider = ({ children }) => {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
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

	const addNewMessage = (chatId, message) => {
		let chatIndex = appState.chats.findIndex((chat) => chat.id === chatId);
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
		appDispatch({type: "addMessage", data: {message: msgCopy, chatId: chatId}})

		socket.emit("send_message", { newMsgObject, chatId });
	};

	const handleIncomingMessage = (message) => {
		let chat = appState.chats.filter(chat => chat.chat_with.id === message.sender.id)[0]
		appDispatch({type: "addMessage", data: {message: {...message, sender:message.sender.id}, chatId: chat.id}})
	}

	useEffect(()=>{
		socket.on('incoming_message', function(msg) {
			console.log("incoming  message")
			handleIncomingMessage(msg)
			})
	}, [])

	return (
		<UsersContext.Provider value={{ users, setUserAsUnread, addNewMessage }}>
			{children}
		</UsersContext.Provider>
	);
};

export { useUsersContext, UsersProvider };
