import React, { useEffect, useState } from "react";
import "./styles/main.css";
import Icon from "../Icon";
import Axios from "axios";

const Loader = ({ done }) => {
	const tokenStr = ""
	const [progress, setProgress] = useState(0)

	useEffect(()=>{
		async function fetch(){
		  let result = await Axios.get('/cha', {
			headers: {"Authorization" : `Token ${tokenStr}`},
			onDownloadProgress: (progressEvent) => {
			  let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
			//   console.log(progressEvent.lengthComputable)
			setProgress(percentCompleted)
			  console.log(percentCompleted);
			}
		  })
		  .then(res => {
			console.log("All DONE: ", res.headers)
			// console.log(res.data)
		  })
		}
	fetch()
	}, [])

	return (
		<div className="loader">
			<div className="loader__logo-wrapper">
				<Icon id="whatsapp" className="loader__logo" />
			</div>
			<div className="loader__container">
				<div className="loader__progress" style={{width: `${progress}%`}}></div>
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
