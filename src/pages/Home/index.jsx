import React, { useEffect, useState } from "react";
import "./styles/main.css";
import Icon from "components/Icon";
import introImgLight from "assets/images/intro-connection-light.jpg";
import introImgDark from "assets/images/intro-connection-dark.jpg";

const Home = () => {
	const [darkTheme, setDarkTheme] = useState(false)

	const onSelectMode = () => {
		// setMode(mode)
		const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		setDarkTheme(userPrefersDark)
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

	return (
		<div className="home">
			<div className="home__img-wrapper">
				<img
					src={darkTheme ? introImgDark : introImgLight}
					alt=""
					className="home__img"
				/>
			</div>

			<h1 className="home__title"> Keep your phone connected </h1>
			<p className="home__text">
				WhatsApp connects to your phone to sync messages. To reduce data usage,
				connect your phone to Wi-Fi.
			</p>
			<p className="home__text">
				<Icon id="laptop" className="home__icon" />
				<span>
					WhatsApp is available for Mac.{" "}
					<a
						href="https://www.whatsapp.com/download"
						target="_blank"
						className="home__link"
						rel="noreferrer"
					>
						{" "}
						Get it here
					</a>
					.
				</span>
			</p>
		</div>
	);
};

export default Home;
