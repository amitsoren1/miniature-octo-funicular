import React, { useContext } from "react";
import Icon from "components/Icon";
import OptionsBtn from "components/OptionsButton";
import StateContext from "context/StateContext";

const Header = ({ user, openProfileSidebar, openSearchSidebar }) => {
	const appState = useContext(StateContext)
	let contact = appState.contacts.filter((contact) => contact.profile.id === user.chat_with.id)[0];

	return (
		<header className="header chat__header">
			<div className="chat__avatar-wrapper" onClick={openProfileSidebar}>
				<img src={user.chat_with.profile_picture} alt={user?.name} className="avatar" />
			</div>

			<div className="chat__contact-wrapper" onClick={openProfileSidebar}>
				<h2 className="chat__contact-name"> {contact?contact.name:`+91 ${user.phone}`}</h2>
				<p className="chat__contact-desc">
					{user.typing ? "typing..." : "online"}
				</p>
			</div>
			<div className="chat__actions">
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
