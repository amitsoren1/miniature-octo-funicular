import React from "react";
import Icon from "components/Icon";
import { Link } from "react-router-dom";
import formatTime from "utils/formatTime";
import { useUsersContext } from "context/usersContext";



const Contact = ({ contact }) => {
	const { setUserAsUnread } = useUsersContext();
	const getLastMessage = () => {
		const messageDates = Object.keys(contact.messages);
		const recentMessageDate = messageDates[messageDates.length - 1];
		// console.log(contact.messages[recentMessageDate])
		const messages = [...contact.messages[recentMessageDate]];
		const lastMessage = messages.pop();
		return lastMessage;
	};

	// const lastMessage = getLastMessage(contact);
	// const lastMessage = {
	// 		content: "mrshujbkjbhkj",
	// 		sender: 1,
	// 		time: "08:11:26",
	// 		status: null,
	// 	}


	return (
	<Link
			className="sidebar-contact"
			to={`/chat/${contact.id}`}
			onClick={() => setUserAsUnread(contact.id)}
		>
			<div className="sidebar-contact__avatar-wrapper">
				<img
					src={contact.profile.profile_picture}
					alt={contact.profile.profile_picture}
					className="avatar"
				/>
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
