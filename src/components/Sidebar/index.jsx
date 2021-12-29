import React, { useContext, useState } from "react";
import "./styles/main.css";
import avatar from "assets/images/profile-picture-girl-1.jpeg";
import isEmpty from "utils/checker"
import Icon from "components/Icon";
import Alert from "./Alert";
import Contact from "./Contact";
import OptionsBtn from "components/OptionsButton";
import { useUsersContext } from "context/usersContext";
import StateContext from "context/StateContext";
import Contacts from "./Contacts";
import Profile from "./Profile";

const Sidebar = () => {
	// const { users: contacts } = useUsersContext();
	const appState = useContext(StateContext)
	const contacts = appState.chats
	// console.log(contacts)
	const [scontacts, setScontacts] = useState(false)
	const [sprofile, setSprofile] = useState(true)

	function handleSlide() {
		setScontacts(!scontacts)
	}

	function handleSlide2() {
		setSprofile(!sprofile)
	}


	return (
		<>
		<aside className="sidebar">
			<header className="header">
				<div className="sidebar__avatar-wrapper">
					{appState.user.profile_picture&&<img src={appState.user.profile_picture} alt="profile picture" className="avatar" />}
					{!appState.user.profile_picture&&<Icon id="avatar" className="avatar"/>}
				</div>
				<div className="sidebar__actions">
					<button className="sidebar__action" aria-label="Status">
						<Icon
							id="status"
							className="sidebar__action-icon sidebar__action-icon--status"
						/>
					</button>
					<button className="sidebar__action" aria-label="New chat" onClick={handleSlide}>
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
				{contacts.map((contact, index) => {
					if(!isEmpty(contact.messages))
						return <Contact key={index} contact={{...contact, profile_picture: contact.chat_with.profile_picture}}/>
					else
						return ""
					})
				}
			</div>
			<div className={scontacts?'slider show_contacts':"slider"}>
				<Contacts handleSlide={handleSlide}/>
			</div>
			<div className={sprofile?'slider2 show_contacts':"slider2"}>
				<Profile handleSlide={handleSlide}/>
			</div>
		</aside>
	</>
	);
};

export default Sidebar;
