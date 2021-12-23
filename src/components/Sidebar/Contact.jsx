import React from "react";
import Icon from "components/Icon";
import { Link } from "react-router-dom";
import formatTime from "utils/formatTime";
import { useUsersContext } from "context/usersContext";

function openForm() {
	document.getElementById("myForm").style.display = "block"
}

function closeForm() {
	document.getElementById("myForm").style.display = "none"
}

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

	const lastMessage = getLastMessage(contact);
	// const lastMessage = {
	// 		content: "mrshujbkjbhkj",
	// 		sender: 1,
	// 		time: "08:11:26",
	// 		status: null,
	// 	}


	return (
		<>
		<Link
			className="sidebar-contact"
			to={`/chat/${contact.id}`}
			onClick={() => setUserAsUnread(contact.id)}
		>
			<div className="sidebar-contact__avatar-wrapper">
				<img
					src={contact.profile_picture}
					alt={contact.profile_picture}
					className="avatar"
				/>
			</div>
			<div className="sidebar-contact__content">
				<div className="sidebar-contact__top-content">
					<h2 className="sidebar-contact__name"> {contact.chat_with.whatsapp_name} </h2>
					<span className="sidebar-contact__time">
						{formatTime(lastMessage.time)}
					</span>
				</div>
				<div className="sidebar-contact__bottom-content">
					<p className="sidebar-contact__message-wrapper">
						{lastMessage.status && (
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
		<div
		className="sidebar-contact"
	>
		<div className="sidebar-contact__content">
			<button class="open-button" onClick={openForm}>Open Form</button>
			<div class="form-popup" id="myForm">

  <form class="form-container">
    <h3>Add new contact</h3>

    <label for="phone"><b>Phone</b></label>
    <input type="text" placeholder="Enter Phone" name="phone" required/>

    <label for="name"><b>Name</b></label>
    <input type="text" placeholder="Enter Name" name="name" required/>

    <button type="submit" class="btn">Add</button>
    <button type="button" class="btn cancel" onClick={closeForm}>Close</button>
  </form>
</div>
		</div>
	</div>
	</>
	);
};

export default Contact;
