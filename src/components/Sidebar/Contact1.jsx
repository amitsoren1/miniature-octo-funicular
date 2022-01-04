import React, { useContext } from "react";
import Icon from "components/Icon";
import { Link } from "react-router-dom";
import { useUsersContext } from "context/usersContext";
import StateContext from "context/StateContext";



const Contact = ({ contact }) => {
	const appState = useContext(StateContext)
	const { setUserAsUnread } = useUsersContext();

	let chat = appState.chats.filter((chat) => chat.chat_with.id === Number(contact.profile.id))[0]

	return (
	<Link
			className="sidebar-contact"
			to={`/chat/${chat.chat_with.id}`}
			onClick={() => setUserAsUnread(contact.id)}
		>
			<div className="sidebar-contact__avatar-wrapper">
				{contact.profile.profile_picture&&<img
					src={contact.profile.profile_picture}
					alt={contact.profile.whatsapp_name}
					className="avatar"
				/>}
				{!contact.profile.profile_picture&&<Icon
					id="avatar"
					className="avatar"
				/>}
			</div>
			<div className="sidebar-contact__content">
				<div className="sidebar-contact__top-content">
					<h2 className="sidebar-contact__name"> {contact.name} </h2>
				</div>
				<div className="sidebar-contact__bottom-content">
					<p className="sidebar-contact__message-wrapper">
						<span className="sidebar-contact__message">
							{contact.typing ? <i> typing...</i> : contact.profile.whatsapp_status}
						</span>
					</p>
				</div>
			</div>
		</Link>
	);
};

export default Contact;
