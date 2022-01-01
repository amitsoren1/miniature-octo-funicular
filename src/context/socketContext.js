import { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";
import DispatchContext from "./DispatchContext";
import StateContext from "./StateContext";

const SOCKET_URL = process.env.REACT_APP_SOCKET_HOST || "http://localhost:8000"

const socket = io.connect(SOCKET_URL);

function asd(){}
function asd2(){}
// const socket = {on: asd, emit: asd2};
// socket.on('connect', function(msg) {
// 	// socket.emit('my_event', {data: 'I\'m connected!'});
// 	console.log("connected")
// 	console.log(msg)
// 	// socket.emit("enter_room", {data: "hoooooohooooooo"})
// });

// socket.on('disconnect', function() {
// 	console.log("disconnected")
// });

// socket.on('get_out', function(msg) {
// 	console.log(msg)
// });

socket.on('hoodone', function(msg) {
	console.log(msg)
});

// socket.on('incoming_message', function(msg) {
// 	console.log("incoming  message")
// 	})


const SocketContext = createContext();

const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)

	useEffect(()=>{
		socket.on('connect', function(msg) {
		// socket.emit('my_event', {data: 'I\'m connected!'});
			console.log("connected")
			console.log(msg)
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
