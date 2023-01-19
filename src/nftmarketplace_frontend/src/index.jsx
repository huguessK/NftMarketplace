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
			<Route exact path="/"><Discover/></Route>
			<Route path="/discover"><Discover/></Route>
			<Route path="/wallet"><Wallet/></Route>
			<Route path="/viewnfts"><NFTS/></Route>
		</Switch>
    </BrowserRouter>
	);
  }
  

  
const runApp = async () => {
	const authClient = await AuthClient.create();
	if(await authClient.isAuthenticated()){
		//to get wallet Id
		UserId = await nftmarketplace_backend.getWalletId();
		UserId = UserId.toText();
		//alert("UserId :" +" "+(UserId));
		//console.log("UserId",UserId);
		handleAuthenticated(authClient);
	} else{

		await authClient.login({
			identityProvider: "https://identity.ic0.app/#authorize",
			onSuccess: async ()=>{
				//to get wallet Id
				UserId = await nftmarketplace_backend.getWalletId();
				UserId = UserId.toText();
				//alert("UserId :" +" "+(UserId));
				//console.log("UserId",UserId);
				handleAuthenticated(authClient);
			}
		})

	}
};


async function handleAuthenticated(authClient){
	ReactDOM.render(<App />, document.getElementById("root"));
}

runApp();

export {UserId};