import React, {useState, useEffect} from "react";

import Footer from "./Footer";



import {Principal} from "@dfinity/principal";

import {idlFactory} from "../../../declarations/nftmarketplace_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";
import NftsGallery from "./NftsGallery";

import {UserId} from "../index";


function NFTS(){

    const [mynftIds, SetMynftsIds]=useState();
    const [walletId, SetWalletId]=useState(UserId);



 useEffect(()=>{
 

    async function fe(){

        const nftsOwnedIdsArray=await nftmarketplace_backend.getOwnedNfts(Principal.fromText(UserId));
        //console.log(nftsOwnedIdsArray);
        const newOwnedIdArray=[];
        for (const id of nftsOwnedIdsArray){
            newOwnedIdArray.push(id.toText());
            console.log("id",id.toText());
        }
        
        console.log(newOwnedIdArray);
        SetMynftsIds(newOwnedIdArray);

        SetWalletId(UserId);
        console.log(mynftIds);
        console.log("end");
    }
    fe();
    

},[]);


if (mynftIds === undefined) {
    return <>loading...</>;
  }


return (
            <>
            <div className="nfts">
                {/*<h1>Your nfts</h1>*/}
                <NftsGallery id={walletId} nftsOwnedIds={mynftIds} Discover={"0"}  buy={"0"} sell={"1"} currentprices={[]}/>
            </div>
             <Footer/>
             </>
        
)

}



export default NFTS;