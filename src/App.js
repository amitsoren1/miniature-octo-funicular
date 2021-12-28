import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SocketProvider, useSocketContext } from "context/SocketContext";
import { UsersProvider } from "context/usersContext";
import StateContext from "context/StateContext";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Sidebar from "components/Sidebar";
import Chat from "pages/Chat";
import Authentication from "pages/Authentication";
import Axios from "axios"
Axios.defaults.baseURL = "http://127.0.0.1:8000"

function App() {
	const socket = useSocketContext()
	const appState = useContext(StateContext)
	const [appLoaded, setAppLoaded] = useState(false);
	const [startLoadProgress, setStartLoadProgress] = useState(false);

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
		stopLoad();
		// Remove listener
		return () => {
		  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {
		  });
		}
	  }, []);

	const stopLoad = () => {
		setStartLoadProgress(true);
		setTimeout(() => setAppLoaded(true), 3000);
	};

	if(!appState.loggedIn) return <Authentication />

	if (!appState.appLoaded || !appState.socketConnected) return <Loader done={startLoadProgress} />;

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
