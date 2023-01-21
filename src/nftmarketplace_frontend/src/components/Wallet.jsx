import React, {useState, useEffect} from "react";

import Footer from "./Footer";


import {Principal} from "@dfinity/principal";

import {idlFactory} from "../../../declarations/nftmarketplace_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";
import NftsGallery from "./NftsGallery";

import {token_backend} from "../../../declarations/token_backend";

import {UserId} from "../index";

import freenft from "../freeNft";



function WalletBody (){
    const [image, SetImage]=useState();
    const [mynft, SetMyNFT]=useState();
    const [nftName, SetNftName]=useState("");
    const [displayNft, setDisplayNft]=useState(false);
    const [mintcompleted,SetMintCompleted]=useState(true);
    const [isminting, SetIsMinting]=useState(true);
    const [balance, SetBalance]=useState("loading...");
    const [response, SetResponse]=useState(true);
    const [message, SetMessage]=useState("");
    
    

    async function Claim(){
        const rep =  await token_backend.Claim(UserId);
        if(rep!="SuccessfulTransaction"){
            SetResponse(false);
            SetMessage(rep);
        }
        else{
            //window.location.href="/wallet";
            window.location.reload();
        }
    }


    useEffect(()=>{
     
        async function getBalance(walletId){
            const balance = await token_backend.Mybalance(UserId);
            SetBalance(balance);
        }
        getBalance(UserId);
        
    },[]);




   function handleSubmit (e)  { 
       
        async function processing (){

            const imageArray=await image[0].arrayBuffer();
            const imageVectNat8 = [...new Uint8Array(imageArray)];
            Mint(nftName,imageVectNat8, false , UserId);
            SetMyNFT(imageVectNat8);

            //console.log(imageVectNat8);
            
        }
        processing();
        e.preventDefault();
    }

   
    


    async function Mint(nft_name, nftDatasNat8, freemint, owner){
        owner = Principal.fromText(owner);
        //alert("owner" + " " + (owner));
        setDisplayNft(true);
        SetIsMinting(false);
        if(!freemint){
        await nftmarketplace_backend.mint(nft_name,nftDatasNat8, freemint, owner);
        //alert("own nft --mint");
        }
        else{
            let FreeMintCounter = await nftmarketplace_backend.FreeMintCount();
            await nftmarketplace_backend.mint("FreeNft #"+(FreeMintCounter),nftDatasNat8, freemint, owner);
            //alert("free nft --mint");
        }
        
        SetIsMinting(true);
        SetMintCompleted(false);
        
    }


    return (
        <div className="wallet-container">
        <div className="content">
        <h1>Mint New Nft</h1>
        
            <div hidden = {displayNft}>

            <h6>Free mint</h6>
            <button className="free-mint-button" style={{marginBottom :"20px"}} onClick={()=>Mint("",freenft,true,UserId)}>Mint free NFT</button>

            <form onSubmit={handleSubmit} >
            <div>
                <h6>Mint your own Nft</h6>
                {/*<label for="name">"Enter a name : e.g. lion #1"</label>*/}
                <input type="text" id="nftname" name="name" placeholder="Enter a name : e.g. lion #1" value={nftName} required
                onChange={e=>SetNftName(e.target.value)}/><br/>
            </div>

            <div>
                {/*<label for="image">Select an image:</label>*/}
                <input type="file" id="image" name="image" accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                required onChange={e=>SetImage(e.target.files)}/><br/>
            </div>

            <div>
            <input type="submit" value="Mint my NFT"/>
            </div>
        </form>
        </div>

      
                <div hidden = {isminting}>
                    Your nft is being mint...
                </div>

                <div hidden = {mintcompleted}>
                    <h6 style={{color: "blue"}}>Mint done</h6>
                </div>
        
        <div>
            <h1 style={{marginTop :"20px"}}>Balance</h1>
            <p>
                Wallet Id {UserId} {/*will be detected automatically with the integration of autenthification -- internet identity */}
            </p>

            <p>Balance = {balance} HK</p>
        </div>

        <div>
            <h1>Claim free tokens, amount 10,000 HK</h1>
            <button onClick={()=>Claim()}>Claim</button>
            <p hidden={response}>{message}</p>
        </div>
        </div>
        </div>
        
    )
}



function Wallet (){
    
    return (
        <>
        <div className="wallet">
        <WalletBody/>
        </div>
        <Footer/>
        </>
    )

}


export default Wallet;