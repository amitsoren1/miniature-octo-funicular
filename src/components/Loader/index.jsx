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
	const [loadapp, setLoadapp] = useState(false)
	const [progress1, setProgress1] = useState(0)
	const [progress2, setProgress2] = useState(0)
	const [progress3, setProgress3] = useState(0)

	useEffect(()=>{
		async function fetch(){
			try {
				const res1 = await Axios.get('/chat', {
					headers: {"Authorization" : `Token ${appState.user.token}`},
					onDownloadProgress: (progressEvent) => {
					let percentCompleted = Math.round((progressEvent.loaded * 60) / progressEvent.total);
					setProgress1(percentCompleted)
					}
				})
				appDispatch({type: "setChats", data: formatChats(res1.data)})
			} catch(error) {
				console.error("An error occured on loading chats")
				appDispatch({type: "logout"})
				return
			}

			try {
				const res2 = await Axios.get('/profile', {
					headers: {"Authorization" : `Token ${appState.user.token}`},
					onDownloadProgress: (progressEvent) => {
					let percentCompleted = Math.round((progressEvent.loaded * 20) / progressEvent.total);
					setProgress2(percentCompleted)
					}
				})
				appDispatch({type: "updateUser", data: res2.data})
			} catch(error) {
				console.error("An error occured on loading profile")
				appDispatch({type: "logout"})
				return
			}

			try {
				const res3 = await Axios.get('/contact', {
				headers: {"Authorization" : `Token ${appState.user.token}`},
				onDownloadProgress: (progressEvent) => {
					let percentCompleted = Math.round((progressEvent.loaded * 20) / progressEvent.total);
					setProgress3(percentCompleted)
				}
				})
				// console.log(res3.data)
				appDispatch({type: "setContacts", data: res3.data})
			} catch(error) {
				console.error("An error occured on loading contacts")
				appDispatch({type: "logout"})
				return
			}

		// await Axios.all([req1, req2]).then(Axios.spread((res1, res2) => {
		// 	// console.log("All DONE: ", res.headers)
		// 	appDispatch({type: "setChats", data: formatChats(res1.data)})
		// 	appDispatch({type: "updateUser", data: res2.data})
		// 	appDispatch({type: "setContacts", data: res3.data})
		// 	appDispatch({type: "loadApp"})
		//   })).catch(Axios.spread((error1, error2) => {
		// 	  console.error("An error occured on loading")
		// 	  appDispatch({type: "logout"})
		//   }))
		}
	if(!appState.appLoaded)
		{
			fetch()
			setLoadapp(true)
		}
	return ()=>{
		appDispatch({type: "loadApp"})
	}
	}, [loadapp])

	return (
		<div className="loader">
			<div className="loader__logo-wrapper">
				<Icon id="whatsapp" className="loader__logo" />
			</div>
			<div className="loader__container">
				<div className="loader__progress" style={{width: `${progress1+progress2+progress3}%`}}></div>
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
