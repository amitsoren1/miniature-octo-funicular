import { createContext, useContext } from "react";
import io from "socket.io-client";

const SOCKET_URL = window.location.origin.includes("localhost")
	? "http://localhost:8000"
	: "https://whatsapp-web-clone-backend.herokuapp.com/";

// const socket = io.connect(SOCKET_URL);
const socket = "fghfd";
// socket.on('connect', function(msg) {
// 	// socket.emit('my_event', {data: 'I\'m connected!'});
// 	console.log("connected")
// 	console.log(msg)
// 	socket.emit("dothing", {data: "hoooooohooooooo"})
// });

// socket.on('disconnect', function() {
// 	console.log("disconnected")
// });

// socket.on('get_out', function(msg) {
// 	console.log(msg)
// });

// socket.on('hoodone', function(msg) {
// 	console.log("hoodone")
// });

const SocketContext = createContext();

const useSocketContext = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export { useSocketContext, SocketProvider };
