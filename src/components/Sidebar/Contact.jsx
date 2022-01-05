import React, { useContext } from "react";
import Icon from "components/Icon";
import { Link } from "react-router-dom";
import formatTime from "utils/formatTime";
import StateContext from "context/StateContext";



const Contact = ({ contact }) => {
	const appState = useContext(StateContext)
	const getLastMessage = () => {
		const messageDates = Object.keys(contact.messages);
		const recentMessageDate = messageDates[messageDates.length - 1];
		// console.log(contact.messages[recentMessageDate])
		const messages = [...contact.messages[recentMessageDate]];
		const lastMessage = messages.pop();
		return lastMessage;
	};

	const lastMessage = getLastMessage(contact);
	let contact_found = appState.contacts.filter((element) => element.profile.id === contact.chat_with.id)[0];


	return (
	<Link
			className="sidebar-contact"
			to={`/chat/${contact.chat_with.id}`}
			// onClick={() => setUserAsUnread(contact.id)}
		>
			<div className="sidebar-contact__avatar-wrapper">
				{contact.profile_picture&&<img
					src={contact.profile_picture}
					alt={contact.profile_picture}
					className="avatar"
				/>}
				{!contact.profile_picture&&<Icon
					id="avatar"
					className="avatar"
				/>}
			</div>
			<div className="sidebar-contact__content">
				<div className="sidebar-contact__top-content">
					<h2 className="sidebar-contact__name"> {contact_found?contact_found.name:`+91 ${contact.phone}`} </h2>
					<span className="sidebar-contact__time">
						{formatTime(lastMessage.time)}
					</span>
				</div>
				<div className="sidebar-contact__bottom-content">
					<p className="sidebar-contact__message-wrapper">
						{lastMessage.sender===appState.user.id && (
							<Icon
								id={
									lastMessage?.status === "sent" ? "singleTick" : "doubleTick"
								}
								aria-label={lastMessage?.status}
								className={`sidebar-contact__message-icon ${
									lastMessage?.status === "read"
										? "sidebar-contact__message-icon--blue"
										: ""
								}`}
							/>
						)}
						<span
							className={`sidebar-contact__message ${
								!!contact.unread ? "sidebar-contact__message--unread" : ""
							}`}
						>
							{contact.typing ? <i> typing...</i> : lastMessage?.content}
						</span>
					</p>
					<div className="sidebar-contact__icons">
						{contact.pinned && (
							<Icon id="pinned" className="sidebar-contact__icon" />
						)}
						{!!contact.unread && (
							<span className="sidebar-contact__unread">{contact.unread}</span>
						)}
						<button aria-label="sidebar-contact__btn">
							<Icon
								id="downArrow"
								className="sidebar-contact__icon sidebar-contact__icon--dropdown"
							/>
						</button>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default Contact;
