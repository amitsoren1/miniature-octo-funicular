import "./styles/main.css";
import { useContext, useState } from "react"
import StateContext from "context/StateContext"
import Icon from "components/Icon"
import Alert from "./Alert"
import OptionsBtn from "components/OptionsButton"

import Contact from "./Contact1"
import Axios from "axios";
import DispatchContext from "context/DispatchContext";

function Contacts({handleSlide}) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
	const contacts = appState.contacts
    const [sform, SetSform] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [nameerror, setNameerror] = useState(null)
    const [phoneerror, setPhoneerror] = useState(null)

    function openForm() {
        SetSform(true)
    }

    function closeForm() {
        SetSform(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await Axios.post("/contact/create", {name, phone},
                                         {headers: {"Authorization" : `Token ${appState.user.token}`}})
            appDispatch({type: "addContact", data: res.data})
            closeForm()
        } catch (error) {
            console.log(error.response.data)
            if("phone" in error.response.data)
                setPhoneerror(error.response.data.phone[0])
            if("name" in error.response.data)
                setNameerror(error.response.data.name[0])
        }
    }

    function handlePhoneChange(e) {
        setPhone(e.target.value)
        setPhoneerror(null)
    }

    function handleNameChange(e) {
        setName(e.target.value)
        setNameerror(null)
    }

    return <>
    <div align="left" className="contacts-header" style={{marginTop:"15%", marginBottom:"4%"}}>
        <div style={{display: "inline-block", paddingLeft:20, color:"#F6F6F6", cursor:"pointer" }}> <Icon id="back" onClick={handleSlide}/></div>
        <div style={{display: "inline-block", textDecorationThickness:"10px", fontSize:"20px", fontWeight:600, paddingLeft:"15px", color:"#F6F6F6", height:"100%"}}> New chat </div>
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
			<div className="form-popup" id="myForm" style={{display: sform?"block":"none"}}>

  <form className="form-container" onSubmit={handleSubmit}>
    <h3>Add new contact</h3>

    <label htmlFor="phone"><b>Phone</b></label>
    <input type="text" className={phoneerror? "add-contact__haserror": ""} placeholder="Enter Phone" value={phone} name="phone" required onChange={handlePhoneChange}/>
    <div className="add-contact__error-message">{phoneerror}</div>

    <label htmlFor="name"><b>Name</b></label>
    <input type="text" className={nameerror? "add-contact__haserror": ""} placeholder="Enter Name" value={name} name="name" required onChange={handleNameChange}/>
    <div className="add-contact__error-message">{nameerror}</div>
    <button type="submit" className="btn">Add</button>
    <button type="button" className="btn cancel" onClick={closeForm}>Close</button>
  </form>
</div>
		</div>
	</div>
    <div className="sidebar__contacts">
        {contacts.map((contact, index) => (
            <Contact key={index} contact={contact}/>
        ))}
    </div>
    </>
}

export default Contacts
