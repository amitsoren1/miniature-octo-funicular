import React, { useContext } from "react";
import "./styles/main.css";
import avatar from "assets/images/profile-picture-girl-1.jpeg";
import Icon from "components/Icon";
import Alert from "./Alert";
import Contact from "./Contact";
import OptionsBtn from "components/OptionsButton";
import { useUsersContext } from "context/usersContext";
import StateContext from "context/StateContext";

const Sidebar = () => {
	// const { users: contacts } = useUsersContext();
	const appState = useContext(StateContext)
	const contacts = appState.chats
	// console.log(contacts)

	return (
		<aside className="sidebar">
			<header className="header">
				<div className="sidebar__avatar-wrapper">
					<img src={appState.user.profile_picture} alt="profile picture" className="avatar" />
				</div>
				<div className="sidebar__actions">
					<button className="sidebar__action" aria-label="Status">
						<Icon
							id="status"
							className="sidebar__action-icon sidebar__action-icon--status"
						/>
					</button>
					<button className="sidebar__action" aria-label="New chat">
						<Icon id="chat" className="sidebar__action-icon" />
					</button>
					<OptionsBtn
						className="sidebar__action"
						ariaLabel="Menu"
						iconId="menu"
						iconClassName="sidebar__action-icon"
						options={[
							"New group",
							"Create a room",
							"Profile",
							"Archived",
							"Starred",
							"Settings",
							"Log out",
						]}
					/>
				</div>
			</header>
			<Alert />
			<div className="search-wrapper">
				<div className="search-icons">
					<Icon id="search" className="search-icon" />
					<button className="search__back-btn">
						<Icon id="back" />
					</button>
				</div>
				<input className="search" placeholder="Search or start a new chat" />
			</div>
			<div className="sidebar__contacts">
				{contacts.map((contact, index) => (
					<Contact key={index} contact={{...contact, profile_picture: contact.chat_with.profile_picture}}/>
				))}
			</div>
		</aside>
	);
};

export default Sidebar;
