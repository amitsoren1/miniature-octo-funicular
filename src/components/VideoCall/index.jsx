import "./styles/main.css"
import Icon from "components/Icon"
import Peer from "simple-peer"
import { useContext, useEffect, useRef, useState } from "react"
import { useSocketContext } from "context/SocketContext"
import StateContext from "context/StateContext"
import DispatchContext from "context/DispatchContext"
import { useUsersContext } from "context/usersContext"


function VideoCall() {
    const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
    const socket = useSocketContext()
	const { stopCallRing } = useUsersContext()
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState()
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ userToCall, setUserToCall ] = useState()
	const [ iCalling, setICalling ] = useState(false)
	const [ callEnded, setCallEnded] = useState(false)
	const [ callRejected, setCallRejected] = useState(false)
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()


	const callUser = (id, call_type) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("call_user", {
				user_to_call: id,
				signal_data: data,
				call_type: call_type,
				from: appState.user,
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.on("call_acepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	useEffect(()=>{
		if(appState.in_call) { //Call coming
			setReceivingCall(true)
			setCaller(appState.in_call.from)
			setCallerSignal(appState.in_call.signal)
		}
		else if(appState.out_call) {
			let chat = appState.chats.filter((chat) => chat.chat_with.id === Number(appState.out_call.id))[0];
			setUserToCall({...chat.chat_with, phone: chat.phone})
			setICalling(true)
			navigator.mediaDevices.getUserMedia({ video: true, audio:  {
				sampleRate: 48000,
				volume: 1.5,
				echoCancellation: true
			} }).then((stream) => {
				setStream(stream)
					myVideo.current.srcObject = stream
			})
		}
	// eslint-disable-next-line
	}, [])

	useEffect(()=>{
		if(stream)
			if(iCalling)
				callUser(appState.out_call.id, appState.out_call.call_type)
			else if(receivingCall&&callAccepted)
				{
					stopCallRing()
					const peer = new Peer({
						initiator: false,
						trickle: false,
						stream: stream
					})
					peer.on("signal", (data) => {
						socket.emit("answer_call", { signal: data, to: caller.id })
					})
					peer.on("stream", (stream) => {
						userVideo.current.srcObject = stream
					})
			
					peer.signal(callerSignal)
					connectionRef.current = peer
				}
	// eslint-disable-next-line
	}, [stream])

	const answerCall =() =>  {
		navigator.mediaDevices.getUserMedia({ video: true, audio:  {
			sampleRate: 48000,
			channelCount: 1,
			volume: 1.5,
			echoCancellation: true
		} }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})
		setCallAccepted(true)
	}

	const leaveCall = () => {
		if(iCalling)
			socket.emit("call_ended", { to: appState.out_call.id })
		if(receivingCall)
			socket.emit("call_ended", { to: appState.in_call.from.id })
		setCallEnded(true)
	}

	const rejectCall = () => {
		stopCallRing()
		socket.emit("call_rejected", { to: appState.in_call.from.id })
		setCallRejected(true)
	}

	useEffect(()=>{
		if(callEnded)
			{
				stream.getTracks().forEach(track => track.stop())
				connectionRef.current.destroy()
				appDispatch({type: "callTo", data: null})
				appDispatch({type: "callFrom", data: null})
			}
		if(callRejected)
			{
				appDispatch({type: "callTo", data: null})
				appDispatch({type: "callFrom", data: null})
			}
	// eslint-disable-next-line
	},[callEnded, callRejected])

	return(
        <div className="video__page">
            <div className="video__container">
                {iCalling&&!callAccepted&&
				<div className="incomingcall">
                    <div className="profile_pic__wrapper">
                        {userToCall.profile_picture&&<img src={userToCall.profile_picture} alt="" className="profpic"/>}
                        {!userToCall.profile_picture&&<Icon id="avatar" className="profpic"/>}
                    </div>
						<h1>
							Calling to +91 {userToCall.phone}
						</h1>
                </div>}

				{receivingCall&&!callAccepted&&
				<div className="incomingcall">
                    <div className="profile_pic__wrapper">
						{caller.profile_picture&&<img src={caller.profile_picture} alt="caller" className="profpic"/>}
                        {!caller.profile_picture&&<Icon id="avatar" className="profpic"/>}
                    </div>
						<h1>
							Call from +91 {caller.phone}
						</h1>
                </div>}

				<div className="big_video__div">
                    <video playsInline autoPlay ref={userVideo} className="videoplayer"></video>
                </div>
                <div className="small_video__div">
                    <video playsInline muted autoPlay ref={myVideo} className="videoplayer"></video>
                </div>

				<div className="btn-flexbox__container">
					{iCalling&&!callAccepted&&
					<div className="call__btn end__call" title="End call" onClick={leaveCall}>
						<Icon id="endCallBtn" className="call__icon"/>
					</div>}

					{receivingCall&&!callAccepted&&<>
					<div className="call__btn accept__call" title="Accept call">
						<Icon id="acceptCallBtn" className="call__icon" onClick={answerCall}/>
					</div>
					<div className="call__btn reject__call" title="Reject call" onClick={rejectCall}>
						<Icon id="endCallBtn" className="call__icon"/>
					</div></>
					}
					{receivingCall&&callAccepted&&
					<div className="call__btn end__call" title="End call" onClick={leaveCall}>
						<Icon id="endCallBtn" className="call__icon"/>
					</div>}

					{iCalling&&callAccepted&&
					<div className="call__btn end__call" title="End call" onClick={leaveCall}>
						<Icon id="endCallBtn" className="call__icon"/>
					</div>}
				</div>

            </div>
        </div>
    )
}

export default VideoCall
