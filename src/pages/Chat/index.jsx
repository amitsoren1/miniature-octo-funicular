import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles/main.css";
import EmojiTray from "./components/EmojiTray";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import ChatSidebar from "./components/ChatSidebar";
import Icon from "components/Icon";
import Search from "./components/Search";
import Profile from "./components/Profile";
import Convo from "./components/Convo";
import { useUsersContext } from "context/usersContext";
import StateContext from "context/StateContext";
import isEmpty from "utils/checker";

const Chat = ({ match, history }) => {
	// const { users, setUserAsUnread, addNewMessage } = useUsersContext();
	const { setUserAsUnread, addNewMessage, chatRead } = useUsersContext();
	const appState = useContext(StateContext)
	const users = appState.chats

	const userId = match.params.id;

	const lastMsgRef = useRef(null);
	const [showAttach, setShowAttach] = useState(false);
	const [showEmojis, setShowEmojis] = useState(false);
	const [showProfileSidebar, setShowProfileSidebar] = useState(false);
	const [showSearchSidebar, setShowSearchSidebar] = useState(false);
	const [newMessage, setNewMessage] = useState("");

	let user = users.filter((user) => user.chat_with.id === Number(userId))[0];

	useEffect(() => {
		if (!user) history.push("/");
		else {
			scrollToLastMsg();
			setUserAsUnread(user.id);
		}
	// eslint-disable-next-line
	}, []);

	useEffect(() => {
		user && scrollToLastMsg();
		if(user)
			chatRead(user.chat_with.id)
	// eslint-disable-next-line
	}, [users]);

	const openSidebar = (cb) => {
		// close any open sidebar first
		setShowProfileSidebar(false);
		setShowSearchSidebar(false);

		// call callback fn
		cb(true);
	};

	const scrollToLastMsg = () => {
		if(!isEmpty(user.messages))
			lastMsgRef.current.scrollIntoView();
	};

	const submitNewMessage = () => {
		addNewMessage(user.chat_with.id, newMessage);
		setNewMessage("");
		scrollToLastMsg();
	};

	if (!user) {
		return <></>
	}
	return (
		<div className="chat">
			<div className="chat__body">
				<div className="chat__bg"></div>

				<Header
					user={user}
					openProfileSidebar={() => openSidebar(setShowProfileSidebar)}
					openSearchSidebar={() => openSidebar(setShowSearchSidebar)}
				/>
				<div className="chat__content">
					<Convo lastMsgRef={lastMsgRef} messages={user.messages} />
				</div>
				<footer className="chat__footer">
					<button
						className="chat__scroll-btn"
						aria-label="scroll down"
						onClick={scrollToLastMsg}
					>
						<Icon id="downArrow" />
					</button>
					<EmojiTray
						showEmojis={showEmojis}
						newMessage={newMessage}
						setNewMessage={setNewMessage}
					/>
					<ChatInput
						showEmojis={showEmojis}
						setShowEmojis={setShowEmojis}
						showAttach={showAttach}
						setShowAttach={setShowAttach}
						newMessage={newMessage}
						setNewMessage={setNewMessage}
						submitNewMessage={submitNewMessage}
					/>
				</footer>
			</div>
			<ChatSidebar
				heading="Search Messages"
				active={showSearchSidebar}
				closeSidebar={() => setShowSearchSidebar(false)}
			>
				<Search />
			</ChatSidebar>

			<ChatSidebar
				heading="Contact Info"
				active={showProfileSidebar}
				closeSidebar={() => setShowProfileSidebar(false)}
			>
				<Profile user={{...user.chat_with, phone: user.phone}} />
			</ChatSidebar>
		</div>
	);
};

export default Chat;
