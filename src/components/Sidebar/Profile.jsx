import "./styles/profile.css";
import { useContext, useEffect, useState } from "react"
import StateContext from "context/StateContext"
import Icon from "components/Icon"
import Alert from "./Alert"
import OptionsBtn from "components/OptionsButton"
import parseMessages from "utils/parseMessages";
import Contact from "./Contact1"
import Axios from "axios";
import DispatchContext from "context/DispatchContext";


function Profile({handleSlide}) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const [picOptions, setPicOptions] = useState(false)

    return <>
    <div align="left" className="contacts-header" style={{marginTop:"15%", marginBottom:"4%"}}>
        <div style={{display: "inline-block", paddingLeft:20, color:"#F6F6F6", cursor:"pointer" }}> <Icon id="back" onClick={handleSlide}/></div>
        <div style={{display: "inline-block", textDecorationThickness:"10px", fontSize:"20px", fontWeight:600, paddingLeft:"15px", color:"#F6F6F6", height:"100%"}}> Profile </div>
    </div>
    <div align="center">
		<div className="sidebar-contact__content" style={{paddingTop: "20px", background: "rgb(19, 28, 33)"}}>
			{/* <div className="profile-pic__container">
                <img src="https://i.pinimg.com/736x/fd/6e/04/fd6e04548095d7f767917f344a904ff1.jpg" style={{height: "100%", width: "100%", objectFit: "contain", borderRadius: "50%"}}/>
                <div className="overlay">
                    <div className="content">
                        <h3>Hi...</h3>
                        <p>This whatsapp</p>
                    </div>
                </div>
            </div> */}
            <div className="image" onClick={()=>setPicOptions(!picOptions)}>
                <img className="image__img" src="https://i.pinimg.com/736x/fd/6e/04/fd6e04548095d7f767917f344a904ff1.jpg" alt="Bricks"/>
                <div className="image__overlay image__overlay--primary">
                    <div className="image__title" style={{color: "white"}}>
                        <Icon id="picCamera"/>
                    </div>
                    <p className="image__description">
                        Here we have a brick wall.
                    </p>
                </div>
            </div>
            <ul
				className={`profile-pic__options ${picOptions?"profile-pic__options--active":""}`}>
					<li className="options-btn__option" key={1}>
						hello
					</li>
                    <li className="options-btn__option" key={2}>
						hello
					</li>
                    <li className="options-btn__option" key={3}>
						hello
					</li>
                    <li className="options-btn__option" key={4}>
						hello
					</li>
			</ul>
            {/* <ul
				className="options-btn__options options-btn__options--active options-btn__options--right">
					<li className="options-btn__option" key={1}>
						hello
					</li>
			</ul> */}
            <div style={{marginTop: "-150px"}}>
                <h1>
                    Hello
                </h1>
            </div>
            <div>
                <h1>
                    Hello
                </h1>
            </div>
		</div>
	</div>
    </>
}

export default Profile
