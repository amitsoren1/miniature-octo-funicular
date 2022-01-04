import "./styles/main.css";
import { useContext, useEffect, useState } from "react"
import StateContext from "context/StateContext"
import Icon from "components/Icon"
import parseMessages from "utils/parseMessages";
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
    const [newContact, setNewContact] = useState(null)
    const [newChat, setnewChat] = useState(null)
    const [loaded, setLoaded] = useState(false)

    function openForm() {
        SetSform(true)
    }

    function closeForm() {
        SetSform(false)
        setName("")
        setPhone("")
        setNameerror(null)
        setPhoneerror(null)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await Axios.post("/contact/create", {name, phone},
                {headers: {"Authorization" : `Token ${appState.user.token}`}})

            let chat = appState.chats.filter((chat) => chat.chat_with.id === Number(res.data.profile.id))[0]
            if(!chat) {
                const res3 = await Axios.post("/chat/create", {chat_with: res.data.profile.id},
                    {headers: {"Authorization" : `Token ${appState.user.token}`}})
                setnewChat({...res3.data, messages: parseMessages(res3.data.messages), chat_with: res.data.profile})
            }
            setNewContact(res.data)
            closeForm()
            setLoaded(true)
        } catch (error) {
            // console.log(error.response.data)
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

    useEffect(()=>{
        if(loaded) {
            if(newContact!=null)
                appDispatch({type: "addContact", data: newContact})
            if(newChat!=null)
                appDispatch({type: "addChat", data: newChat})
        }
    // eslint-disable-next-line
    }, [newContact, newChat, loaded])

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
