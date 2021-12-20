import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SocketProvider } from "context/socketContext";
import { UsersProvider } from "context/usersContext";
import StateContext from "context/StateContext";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import Sidebar from "components/Sidebar";
import Chat from "pages/Chat";
import Authentication from "pages/Authentication";
import Axios from "axios"
Axios.defaults.baseURL = "http://127.0.0.1:8000"

const userPrefersDark =
	window.matchMedia &&
	window.matchMedia("(prefers-color-scheme: dark)").matches;

function App() {
	const appState = useContext(StateContext)
	const [appLoaded, setAppLoaded] = useState(false);
	const [startLoadProgress, setStartLoadProgress] = useState(false);

	useEffect(() => {
		if (userPrefersDark) document.body.classList.add("dark-theme");
		stopLoad();
	}, []);

	const stopLoad = () => {
		setStartLoadProgress(true);
		setTimeout(() => setAppLoaded(true), 3000);
	};

	if(!appState.loggedIn) return <Authentication />

	if (!appLoaded) return <Loader done={startLoadProgress} />;

	return (
		<SocketProvider>
			<UsersProvider>
				<div className="app">
					<p className="app__mobile-message"> Only available on desktop 😊. </p>
					<Router>
						<div className="app-content">
							<Sidebar />
							<Switch>
								<Route path="/chat/:id" component={Chat} />
								<Route component={Home} />
							</Switch>
						</div>
					</Router>
				</div>
			</UsersProvider>
		</SocketProvider>
	);
}

export default App;
