import "./styles/main.css";
import { useContext } from "react"
import StateContext from "context/StateContext"
import Icon from "components/Icon"
import Alert from "./Alert"
import OptionsBtn from "components/OptionsButton"

import Contact from "./Contact"

function openForm() {
	document.getElementById("myForm").style.display = "block"
}

function closeForm() {
	document.getElementById("myForm").style.display = "none"
}

function Contacts({handleSlide}) {
    const appState = useContext(StateContext)
	const contacts = appState.chats

    return <>
    <div align="left" className="contacts-header" style={{marginTop:"15%", marginBottom:"4%"}}>
        <div style={{display: "inline-block", paddingLeft:20, color:"#F6F6F6", cursor:"pointer" }}> <Icon id="back" onClick={handleSlide}/></div>
        <text style={{display: "inline-block", textDecorationThickness:"10px", fontSize:"20px", fontWeight:600, paddingLeft:"15px", color:"#F6F6F6", height:"100%"}}> New chat </text>
    </div>
    <div className="search-wrapper">
        <div className="search-icons">
            <Icon id="search" className="search-icon" />
            <button className="search__back-btn">
                <Icon id="back" />
            </button>
        </div>
        <input className="search" placeholder="Search or start a new chat" />
    </div>
    <div align="center">
		<div className="sidebar-contact__content">
			<button className="open-button" onClick={openForm}>Add new contact</button>
			<div className="form-popup" id="myForm">

  <form className="form-container">
    <h3>Add new contact</h3>

    <label htmlFor="phone"><b>Phone</b></label>
    <input type="text" placeholder="Enter Phone" name="phone" required/>

    <label htmlFor="name"><b>Name</b></label>
    <input type="text" placeholder="Enter Name" name="name" required/>

    <button type="submit" className="btn">Add</button>
    <button type="button" className="btn cancel" onClick={closeForm}>Close</button>
  </form>
</div>
		</div>
	</div>
    <div className="sidebar__contacts">
        {contacts.map((contact, index) => (
            <Contact key={index} contact={{...contact, profile_picture: contact.chat_with.profile_picture}}/>
        ))}
    </div>
    </>
}

export default Contacts
