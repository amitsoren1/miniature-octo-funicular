import { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL

const socket = io.connect(SOCKET_URL);

const SocketContext = createContext();

const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	useEffect(()=>{
		socket.on('connect', function(msg) {
		// socket.emit('my_event', {data: 'I\'m connected!'});
			console.log("connected")
			appDispatch({type: "connectedSocket"})
			})

		socket.on('disconnect', function(msg) {
			console.log("disconnected")
			appDispatch({type: "disconnectedSocket"})
			})
	}, [])

	useEffect(()=>{
		if(appState.socketConnected && appState.appLoaded)
			socket.emit("join", {id: appState.user.id})
	}, [appState.appLoaded])

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export { useSocketContext, SocketProvider };
