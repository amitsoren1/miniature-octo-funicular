import React, { useContext, useEffect, useState } from "react";
import Icon from "components/Icon";
import OptionsBtn from "components/OptionsButton";
import StateContext from "context/StateContext";
import DispatchContext from "context/DispatchContext";
import { useSocketContext } from "context/SocketContext";

const Header = ({ user, openProfileSidebar, openSearchSidebar }) => {
	const [userStatus, setUserStatus] = useState()
	const socket = useSocketContext()
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	let contact = appState.contacts.filter((contact) => contact.profile.id === user.chat_with.id)[0];
	function makeVideoCall() {
		appDispatch({type: "callTo", data: {id: user.chat_with.id, call_type: "video"}})
	}
	function makeAudioCall() {
		appDispatch({type: "callTo", data: {id: user.chat_with.id, call_type: "audio"}})
	}

	useEffect(()=>{
		socket.emit("get_user_status", {"status_of": user.chat_with.id}) //call only once

		socket.on("user_status", (msg)=>{
			setUserStatus(msg.status_result)
		})

		socket.on("went_offline", (msg)=>{
			if(msg.user_id === user.chat_with.id)
				setUserStatus("last seen " + msg.last_seen)
		})

		socket.on("went_online", (msg)=>{
			if(msg.user_id === user.chat_with.id)
				setUserStatus("online")
		})
	}, [])

	return (
		<header className="header chat__header">
			<div className="chat__avatar-wrapper" onClick={openProfileSidebar}>
				{user.chat_with.profile_picture&&<img src={user.chat_with.profile_picture} alt={user?.name} className="avatar" />}
				{!user.chat_with.profile_picture&&<Icon id="avatar" className="avatar"/>}
			</div>

			<div className="chat__contact-wrapper" onClick={openProfileSidebar}>
				<h2 className="chat__contact-name"> {contact?contact.name:`+91 ${user.phone}`}</h2>
				<p className="chat__contact-desc">
					{user.typing ? "typing..." : userStatus}
				</p>
			</div>
			<div className="chat__actions">
				<button
					className="chat__action"
					aria-label="Search"
					onClick={makeVideoCall}
				>
					<Icon
						id="videoCall"
						className="chat__action-icon chat__action-icon--search"
					/>
				</button>
				<button
					className="chat__action"
					aria-label="Search"
					onClick={makeAudioCall}
				>
					<Icon
						id="audioCall"
						className="chat__action-icon chat__action-icon--search"
					/>
				</button>
				<button
					className="chat__action"
					aria-label="Search"
					onClick={openSearchSidebar}
				>
					<Icon
						id="search"
						className="chat__action-icon chat__action-icon--search"
					/>
				</button>
				<OptionsBtn
					className="chat__action"
					ariaLabel="Menu"
					iconId="menu"
					iconClassName="chat__action-icon"
					options={[
						"Contact Info",
						"Select Messages",
						"Mute notifications",
						"Clear messages",
						"Delete chat",
					]}
				/>
			</div>
		</header>
	);
};

export default Header;
