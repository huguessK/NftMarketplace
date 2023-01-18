import React, {useState, useEffect} from "react";

import Header from "./Header";
import Footer from "./Footer";



import {Principal} from "@dfinity/principal";

import {idlFactory} from "../../../declarations/nftmarketplace_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";
import NftsGallery from "./NftsGallery";



function NFTS(){

    const [mynftIds, SetMynftsIds]=useState();
    const [walletId, SetWalletId]=useState("2vxsx-fae");



 useEffect(()=>{
 

    async function fe(){

        const nftsOwnedIdsArray=await nftmarketplace_backend.getOwnedNfts(Principal.fromText("2vxsx-fae"));
        //console.log(nftsOwnedIdsArray);
        const newOwnedIdArray=[];
        for (const id of nftsOwnedIdsArray){
            newOwnedIdArray.push(id.toText());
            console.log("id",id.toText());
        }
        
        console.log(newOwnedIdArray);
        SetMynftsIds(newOwnedIdArray);

        SetWalletId("2vxsx-fae");
        console.log(mynftIds);
        console.log("end");
    }
    fe();
    

},[]);


if (mynftIds === undefined) {
    return <>loading...</>;
  }


return (

            <div>
                <Header/>
                <h1>Your nfts</h1>
                <NftsGallery id={walletId} nftsOwnedIds={mynftIds} Discover={"0"}  buy={"0"} sell={"1"} currentprices={[]}/>
                <Footer/>
            </div>
        
)

}



export default NFTS;