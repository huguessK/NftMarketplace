import React, {useState, useEffect} from "react";

import Header from "./Header";
import Footer from "./Footer";
import NftsGallery from "./NftsGallery";
import {nft_backend} from "../../../declarations/nft_backend";

import {token_backend} from "../../../declarations/token_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";



function DiscoverBody(){

    const [mynftIds, SetMynftsIds]=useState();
    const [walletId, SetWalletId]=useState("2vxsx-fae");


 useEffect(()=>{
 

    async function fe(){

        const nftsOwnedIdsArray=await nftmarketplace_backend.onSale();
        console.log("discover_ar",nftsOwnedIdsArray);
        const newOwnedIdArray=[];
        for (const id of nftsOwnedIdsArray){
            newOwnedIdArray.push(id.toText());
            console.log("id",id.toText());
        }
        
        console.log("discover",newOwnedIdArray);
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
                <h1>Nfts on sale</h1>
                <NftsGallery id={walletId} nftsOwnedIds={mynftIds} Discover={"1"} buy={"1"} sell={"0"}/>
            </div>
        
)

}







function Discover (){
    return (
        <>
        <Header/>
        <DiscoverBody/>
        <Footer/>
        </>
    )

}


export default Discover;