import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";



import Discover from "./components/Discover";
import Wallet from "./components/Wallet";
import NFTS from "./components/NFTS";


/*const WALLET_ID = Principal.fromText("2vxsx-fae");
export default WALLET_ID;*/


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
	ReactDOM.render(<App />, document.getElementById("root"));
  };
  
  runApp();