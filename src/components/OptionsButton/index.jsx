import React, { useContext, useState } from "react";
import Icon from "components/Icon";
import "./styles/main.css";
import DispatchContext from "context/DispatchContext";
import Axios from "axios";
import StateContext from "context/StateContext";

const OptionsBtn = ({
	className,
	iconId,
	iconClassName,
	ariaLabel,
	options = [],
	position = "left",
	showPressed = true,
	...props
}) => {
	const [showOptions, setShowOptions] = useState(false);
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	async function handleClick(option) {
		if(option==="Log out")
			{
				try {
					const res = await Axios.post("/logout", {}, {headers: {"Authorization" : `Token ${appState.user.token}`}})
					console.log(`Token ${appState.user.token}`)
					console.log(res.status, res.data)
				}
				catch (error) {
					console.error("An error occured while logging out")
					console.log(error)
				}
				appDispatch({type: "logout"})
			}
	}

	return (
		<div className="pos-rel">
			<button
				aria-label={ariaLabel}
				className={`options-btn ${
					showOptions && showPressed ? "options-btn--pressed" : ""
				} ${className || ""}`}
				onClick={() => setShowOptions(!showOptions)}
				{...props}
			>
				<Icon id={iconId} className={iconClassName} />
			</button>
			<ul
				className={`options-btn__options ${
					showOptions ? "options-btn__options--active" : ""
				} ${position === "right" ? "options-btn__options--right" : ""}`}
			>
				{options.map((option, index) => (
					<li className="options-btn__option" key={index} onClick={e=>handleClick(option)}>
						{option}
					</li>
				))}
			</ul>
		</div>
	);
};

export default OptionsBtn;
