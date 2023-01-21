import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";

import {AuthClient} from "@dfinity/auth-client";

import Discover from "./components/Discover";
import Wallet from "./components/Wallet";
import NFTS from "./components/NFTS";

import {nftmarketplace_backend} from "../../declarations/nftmarketplace_backend";

let UserId = " ";




export default function App() {
 
	return (
		<BrowserRouter>
		<Switch>
			<Route exact path="/">
				<Discover/>
			</Route>
			
			<Route path="/discover/:id">
				<Discover/>
			</Route>

			<Route path="/wallet/:id">
				<Wallet/>
			</Route>

			<Route path="/viewnfts/:id">
				<NFTS/>
			</Route>
		</Switch>
    </BrowserRouter>
	);
  }
  

  
const runApp = async () => {
	const authClient = await AuthClient.create();
	if(await authClient.isAuthenticated()){
		//UserId="2vxsx-fae";
		UserId = await nftmarketplace_backend.getWalletId();
		UserId = UserId.toText();
		let currentLocation = window.location.href;
		//if Fake wallet 1
		if(currentLocation.includes("wallet1")) {UserId="hozae-racaq-aaaaa-aaaaa-c";}
		//if Fake wallet 2
		else if(currentLocation.includes("wallet2")) {UserId="midn7-ayaaa-aaaag-qbq6q-cai";}
		//if my wallet -> caller principal id associated to my device
		else{
			UserId="2vxsx-fae";
		}
		//alert("current Wallet" + " " + (UserId));
		handleAuthenticated(authClient);
	} else{

		await authClient.login({
			identityProvider: "https://identity.ic0.app/#authorize",
			onSuccess: async ()=>{
				//UserId="2vxsx-fae";
				UserId = await nftmarketplace_backend.getWalletId();
				UserId = UserId.toText();
				handleAuthenticated(authClient);
			}
		})

	}
};




async function handleAuthenticated(authClient){
	ReactDOM.render(<App />, document.getElementById("root"));
}

export {UserId}; 
runApp();