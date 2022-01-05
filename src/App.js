import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UsersProvider } from "context/usersContext";
import StateContext from "context/StateContext";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Sidebar from "components/Sidebar";
import Chat from "pages/Chat";
import Authentication from "pages/Authentication";
import Axios from "axios"
import VideoCall from "components/VideoCall";
import AudioCall from "components/AudioCall";
Axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL

function App() {
	const appState = useContext(StateContext)

	const onSelectMode = () => {
		const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (userPrefersDark)
		  document.body.classList.add('dark-theme')
		else
		  document.body.classList.remove('dark-theme')
	  }

	useEffect(() => {
		// Add listener to update styles
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => onSelectMode());
	  
		// Setup dark/light mode for the first time
		onSelectMode()
		// Remove listener
		return () => {
		  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {
		  });
		}
	  }, []);

	if((appState.in_call && appState.in_call.call_type==="video") || (appState.out_call && appState.out_call.call_type==="video"))
		return <VideoCall/>
	if((appState.in_call && appState.in_call.call_type==="audio") || (appState.out_call && appState.out_call.call_type==="audio"))
		return <AudioCall/>

	if(!appState.loggedIn) return <Authentication />

	if (!appState.appLoaded || !appState.socketConnected) return <Loader/>;

	return (
		<UsersProvider>
			<div className="app">
				<p className="app__mobile-message"> Only available on desktop 😊. </p>
				<Router>
					<div className="app-content">
						<Sidebar />
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/chat/:id" component={Chat} />
						</Switch>
					</div>
				</Router>
			</div>
		</UsersProvider>
	);
}

export default App;
