import React, { useContext, useEffect, useState } from "react";
import "./styles/main.css";
import Icon from "../Icon";
import Axios from "axios";
import StateContext from "context/StateContext";
import DispatchContext from "context/DispatchContext";
import parseMessages from "utils/parseMessages";

function formatChats(chats1) {
	const chats = []
	chats1.forEach(chat => {
		chats.push({...chat, messages: parseMessages(chat.messages)})
	});
	return chats
}

const Loader = ({ done }) => {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const [progress, setProgress] = useState(0)
	const [progress1, setProgress1] = useState(0)
	const [progress2, setProgress2] = useState(0)

	useEffect(()=>{
		async function fetch(){
			const req1 = Axios.get('/chat', {
				headers: {"Authorization" : `Token ${appState.user.token}`},
				onDownloadProgress: (progressEvent) => {
				  let percentCompleted = Math.round((progressEvent.loaded * 80) / progressEvent.total);
				//   console.log(progressEvent.lengthComputable)
				setProgress1(percentCompleted)
				}
			})

			const req2 = Axios.get('/profile', {
				headers: {"Authorization" : `Token ${appState.user.token}`},
				onDownloadProgress: (progressEvent) => {
				  let percentCompleted = Math.round((progressEvent.loaded * 20) / progressEvent.total);
				// console.log(progress+percentCompleted, "second")
				  setProgress2(percentCompleted)
				}
			  })

		Axios.all([req1, req2]).then(Axios.spread((res1, res2) => {
			// console.log("All DONE: ", res.headers)
			appDispatch({type: "setChats", data: formatChats(res1.data)})
			appDispatch({type: "updateUser", data: res2.data})
			appDispatch({type: "loadApp"})
			console.log(res2.data)
		  })).catch(Axios.spread((error1, error2) => {
			  console.error("An error occured on loading")
		  }))
		}

	fetch()
	}, [])

	return (
		<div className="loader">
			<div className="loader__logo-wrapper">
				<Icon id="whatsapp" className="loader__logo" />
			</div>
			<div className="loader__container">
				<div className="loader__progress" style={{width: `${progress1+progress2}%`}}></div>
			</div>
			<h1 className="loader__title"> Whatsapp</h1>
			<p className="loader__desc">
				<Icon id="lock" className="loader__icon" />
				End-to-end encrypted. Built by Karen Okonkwo.
			</p>
		</div>
	);
};

export default Loader;
