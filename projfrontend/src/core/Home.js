import React from 'react';
import "../styles.css";
import {API} from "../backend.js";
import Base from "./Base.js";
export default function Home(){
	console.log("API IS", API);
	return(
		<Base title = "Home Page">
			<h1 className = "text-white">Hello Frontend !</h1>
		</Base>
	)
}