import React, {useState, useEffect} from "react";


import Footer from "./Footer";
import NftsGallery from "./NftsGallery";
import {nft_backend} from "../../../declarations/nft_backend";

import {token_backend} from "../../../declarations/token_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";

import {Actor, HttpAgent} from "@dfinity/agent";
import {idlFactory} from "../../../declarations/nft_backend";

import {UserId} from "../index";


function DiscoverBody(){

    const [mynftIds, SetMynftsIds]=useState();
    const [pricesArray,  SetPriceArray]=useState();
    const [sellerArray,  SetSellerArray]=useState();
    const [walletId, SetWalletId]=useState(UserId);
   

 useEffect(()=>{
 

    async function fe(){

        const nftsOwnedIdsArray=await nftmarketplace_backend.onSale();
        const newpricesArray=[];
        const newsellerArray=[];

        //console.log("discover_ar",nftsOwnedIdsArray);
        const newOwnedIdArray=[];
        for (const id of nftsOwnedIdsArray){
            newOwnedIdArray.push(id.toText());
            //console.log("id",id.toText());


            //get current price

            //const localHost = "http://localhost:8080/";
              //nft_backend canister ID -> 'dfx canister id nft_backend' in the terminal
              //const id = Principal.fromText(principalID); 
              //const agent = new HttpAgent ({host: localHost});
              const agent = new HttpAgent();
              const NFTActor = await Actor.createActor(idlFactory,{
                  agent,
                  canisterId: id,
              });

             let currentprice = NFTActor.GetCurrentPrice();
             let owner = await nftmarketplace_backend.getSellerId(id); //return a principal
             owner =owner.toText();
             newpricesArray.push(currentprice);
             newsellerArray.unshift(owner);
        }
        
        //console.log("discover",newOwnedIdArray);
        //console.log("discoverpricearray",newpricesArray);
        //console.log("discoversellerarray",newsellerArray);
        SetMynftsIds(newOwnedIdArray);
        SetPriceArray(newpricesArray);
        SetSellerArray(newsellerArray);
        SetWalletId(UserId);
        //console.log(mynftIds);
        //console.log("end");
    }
    fe();
    

},[]);


if (mynftIds === undefined) {
    return <>loading...</>;
  }


return (

            <div>
                {/*<h1>Nfts on sale</h1>*/}
                <NftsGallery id={walletId} nftsOwnedIds={mynftIds} Discover={"1"} buy={"1"} sell={"0"} currentprices={pricesArray} sellerArray={sellerArray}/>
            </div>
        
)

}


function Discover (){
    return (
        <>
        <div className="discover">
        <DiscoverBody/>
        </div>
        <Footer/>
        </>
    )

}


export default Discover;