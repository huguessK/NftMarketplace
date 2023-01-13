import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';

import {Actor, HttpAgent} from "@dfinity/agent";
import {Principal} from "@dfinity/principal";

import {idlFactory} from "../../declarations/nftmarketplace_backend";
import {nftmarketplace_backend} from "../../declarations/nftmarketplace_backend";

import {idlFactoryNFT} from "../../declarations/nft_backend";
import {nft_backend} from "../../declarations/nft_backend";

import {idlFactoryToken} from "../../declarations/token_backend";
import {token_backend} from "../../declarations/token_backend";




const App = ()=>{

const [nftImage,setNftImage]=useState();


async function Marketplace(){
	/*const localHost = "http://localhost:8080/";
	//nftmarketplace_backend canister ID -> dfx canister id nftmarketplace_backend
	const id = Principal.fromText("fterm-bydaq-aaaaa-aaaaa-c"); 
	const agent = new HttpAgent ({host: localHost});
	const MarketplaceActor = await Actor.createActor(idlFactory,{
		agent,
		canisterId: id,
	});*/

//mint
const nftdatas =
[137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 
0, 13, 73, 72, 68, 82, 0, 0, 0, 10, 0, 
0, 0, 10, 8, 6, 0, 0, 0, 141, 50, 207, 
189, 0, 0, 0, 1, 115, 82, 71, 66, 0, 174,
206, 28, 233, 0, 0, 0, 68, 101, 88, 73,
102, 77, 77, 0, 42, 0, 0, 0, 8, 0, 1, 135,
105, 0, 4, 0, 0, 0, 1, 0, 0, 0, 26, 0, 0, 0,
0, 0, 3, 160, 1, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0,
160, 2, 0, 4, 0, 0, 0, 1, 0, 0, 0, 10, 160, 3,
0, 4, 0, 0, 0, 1, 0, 0, 0, 10, 0, 0, 0, 0, 59,
120, 184, 245, 0, 0, 0, 113, 73, 68, 65, 84,
24, 25, 133, 143, 203, 13, 128, 48, 12, 67,
147, 94, 97, 30, 24, 0, 198, 134, 1, 96, 30,
56, 151, 56, 212, 85, 68, 17, 88, 106, 243,
241, 235, 39, 42, 183, 114, 137, 12, 106, 73,
236, 105, 98, 227, 152, 6, 193, 42, 114, 40,
214, 126, 50, 52, 8, 74, 183, 108, 158, 159,
243, 40, 253, 186, 75, 122, 131, 64, 0, 160,
192, 168, 109, 241, 47, 244, 154, 152, 112,
237, 159, 252, 105, 64, 95, 48, 61, 12, 3, 61,
167, 244, 38, 33, 43, 148, 96, 3, 71, 8, 102,
4, 43, 140, 164, 168, 250, 23, 219, 242, 38,
84, 91, 18, 112, 63, 0, 0, 0, 0, 73, 69, 78,
68, 174, 66, 96, 130];

await nftmarketplace_backend.mint("Test #12",nftdatas);


const getnftowned = await nftmarketplace_backend.getOwnedNfts(Principal.fromText("2vxsx-fae"));
/*for (nftid in getnftowned){
	console.log(nftid.toText());
}*/
const principalOfFirstNftOwned=getnftowned[0].toText();
console.log(principalOfFirstNftOwned);

//get minted nft datas

let nft_datas = await nft_backend.GetDatas(Principal.fromText(principalOfFirstNftOwned));
nft_datas = new Uint8Array(nftdatas);
const nft_image = URL.createObjectURL(
	new Blob([nft_datas.buffer], {type : "image/png"})
);

setNftImage(nft_image);

}

useEffect(()=>{
	Marketplace();
},[]);


    return (
		<>
        <h1>Welcome to your NFT marketplace</h1>
		<img src={nftImage} alt="nft image"></img>
		</>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));