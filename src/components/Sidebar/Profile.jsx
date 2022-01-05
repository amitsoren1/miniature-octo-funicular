import "./styles/profile.css";
import { useContext, useRef, useState } from "react"
import StateContext from "context/StateContext"
import Icon from "components/Icon"
import Axios from "axios";
import DispatchContext from "context/DispatchContext";


function Profile({handleSlide}) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const [picOptions, setPicOptions] = useState(false)
    const [viewPic, setViewPic] = useState(false)
    const [snameLine, setSnameLine] = useState(false)
    const [saboutLine, setSaboutLine] = useState(false)
    const [name, setName] = useState(appState.user.whatsapp_name)
    const [about, setAbout] = useState(appState.user.whatsapp_status)
    // const [name, setName] = useState("")
    // const [about, setAbout] = useState("")
    const newPicRef = useRef(null)
    const nameRef = useRef(null)
    const aboutRef = useRef(null)

    const handleEditName = ()=> {
        setSnameLine(true)
        nameRef.current.focus()
    }

    const handleEditAbout = ()=> {
        setSaboutLine(true)
        aboutRef.current.focus()
    }

    async function handleSubmitName() {
        try {
            const res = await Axios.patch("/profile", {whatsapp_name: name}, {headers: {Authorization: `Token ${appState.user.token}`}})
            appDispatch({type: "updateUser", data: {whatsapp_name: res.data.whatsapp_name}})
            setSnameLine(false)
        } catch(err) {
            console.error("error occured in name edit")
        }
    }

    async function handleSubmitAbout() {
        try {
            const res = await Axios.patch("/profile", {whatsapp_status: about}, {headers: {Authorization: `Token ${appState.user.token}`}})
            appDispatch({type: "updateUser", data: {whatsapp_status: res.data.whatsapp_status}})
            setSaboutLine(false)
        } catch(err) {
            console.error("error occured in about edit")
        }
    }

    async function handleDeletePhoto() {
        const formData = new FormData()
        formData.append('profile_picture', new File([], ''));

        try {
            const res = await Axios.patch("/profile", formData, {headers: {Authorization: `Token ${appState.user.token}`, 'Content-Type': 'multipart/form-data'}})
            appDispatch({type: "updateUser", data: {profile_picture: res.data.profile_picture}})
            setPicOptions(false)
        } catch(err) {
            console.error("error occured in about edit")
        }
    }

    async function handleUploadPhoto() {
        const formData = new FormData()
        formData.append('profile_picture', newPicRef.current.files[0])

        try {
            const res = await Axios.patch("/profile", formData, {headers: {Authorization: `Token ${appState.user.token}`, 'Content-Type': 'multipart/form-data'}})
            appDispatch({type: "updateUser", data: {profile_picture: res.data.profile_picture}})
            setPicOptions(false)
        } catch(err) {
            console.error("error occured in about edit")
        }
    }

return <>
    <div align="left" className="contacts-header">
        <div style={{display: "inline-block", paddingLeft:20, color:"#F6F6F6", cursor:"pointer" }}> <Icon id="back" onClick={handleSlide}/></div>
        <div style={{display: "inline-block", textDecorationThickness:"10px", fontSize:"20px", fontWeight:600, paddingLeft:"15px", color:"#F6F6F6", height:"100%"}}> Profile </div>
    </div>
    <div align="center">
		<div className="sidebar-contact__content" style={{paddingTop: "20px"}}>
            <div className="image" onClick={()=>setPicOptions(!picOptions)}>
                {appState.user.profile_picture&&<img className="image__img" src={appState.user.profile_picture} alt="Bricks"/>}
                {!appState.user.profile_picture&&<Icon id="avatar" className="image__img"/>}
                <div className={`image__overlay image__overlay--primary ${picOptions?"image__clicked":""}`}>
                    <div className="image__title" style={{color: "white"}}>
                        <Icon id="picCamera"/>
                    </div>
                    <p className="image__description">
                        CHANGE
                    </p>
                    <p className="image__description">
                        PROFILE PHOTO
                    </p>
                </div>
            </div>
            <ul
				className={`profile-pic__options ${picOptions?"profile-pic__options--active":""}`}>
					<li className="options-btn__option option-left__align" key={1} onClick={()=>setViewPic(true)}>
						View photo
					</li>
                    <li className="options-btn__option option-left__align" key={2}>
						Take photo
					</li>
                    <li className="options-btn__option option-left__align" key={3} onClick={e=>newPicRef.current.click()}>
						Upload photo
					</li>
                    <li className="options-btn__option option-left__align" key={4} onClick={handleDeletePhoto}>
						Remove photo
					</li>
                    <input type="file" ref={newPicRef} style={{display:"none"}} onChange={handleUploadPhoto}/>
			</ul>

            <div className="profile-infona">
                <div className="namediv">
                    <p style={{textAlign: "left", fontSize:"14px", color: "rgb(0, 175, 156)"}}>Your name</p>
                    <div className="form-inline">
                        <input type="text" ref={nameRef} value={name} readOnly={!snameLine} onChange={e=>setName(e.target.value)}/>
                        {snameLine&&<Icon id="okClick" className="prof_submit__btn" onClick={handleSubmitName}/>}
                        {!snameLine&&<Icon id="editPen" className="prof_submit__btn" onClick={handleEditName}/>}
                    </div>
                    <div style={{height:"2px", opacity:snameLine?1:0, background:"rgb(0, 175, 156)", marginRight:"10%"}}></div>
                </div>
                <div className="disclaimerdiv">
                    <p style={{textAlign: "left", fontSize:"14px", color: "gray"}}>This is
                        not your username or pin. This name will be visible to your Whats App contacts</p>
                </div>
                <div className="aboutdiv">
                    <p style={{textAlign: "left", fontSize:"14px", color: "rgb(0, 175, 156)"}}>About</p>
                    <div className="form-inline">
                        <input type="text" ref={aboutRef} value={about} readOnly={!saboutLine} onChange={e=>setAbout(e.target.value)} required={true}/>
                        {saboutLine&&<Icon id="okClick" className="prof_submit__btn" onClick={handleSubmitAbout}/>}
                        {!saboutLine&&<Icon id="editPen" className="prof_submit__btn" onClick={handleEditAbout}/>}
                    </div>
                    <div style={{height:"2px", opacity:saboutLine?1:0, background:"rgb(0, 175, 156)", marginRight:"10%"}}></div>
                </div>
            </div>
		</div>
	</div>
    {/* <!-- The Modal --> */}
    <div className="profilepic__Modal" style={{display: viewPic?"block":"none"}}>

        {/* <!-- The Close Button --> */}
        <span className="close-view" onClick={()=>setViewPic(false)}>&times;</span>

        {/* <!-- Modal Content (The Image) --> */}
        <img className="modal-image" id="img01" src={appState.user.profile_picture} alt="big_profile_picture"/>
    </div>
    </>
}

export default Profile
