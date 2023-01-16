import React, {useState, useEffect} from "react";

import {Principal} from "@dfinity/principal";
import {Actor, HttpAgent} from "@dfinity/agent";

import {idlFactory} from "../../../declarations/nft_backend";
import {nft_backend} from "../../../declarations/nft_backend";




function NftsGallery(props){
    const done=0;
    const nftsOwnedIdsArray = props.nftsOwnedIds;
    const [alldatas, SetAllDatas]=useState();
    
    //const walletId = Principal.fromText(props.id);
    const walletId = props.id;
    const datas =[];
   

    
    function NFTImage(props){
        return(
            <div>
                <img src={props.image} alt={props.name}></img>
                <h6>{props.name}</h6>
            </div>
        )
    }



    
const ShowGallery=()=>{
 
   useEffect(()=>{
    
    async function NftsOwned(){
    
    
        //console.log("nftsOwned",nftsOwnedIdsArray);
        for (const principalID of nftsOwnedIdsArray){
            //console.log("principalId",principalID);


            const localHost = "http://localhost:8080/";
	        //nft_backend canister ID -> 'dfx canister id nft_backend' in the terminal
	        const id = Principal.fromText(principalID); 
	        const agent = new HttpAgent ({host: localHost});
            const NFTActor = await Actor.createActor(idlFactory,{
                agent,
                canisterId: id,
            });

            const imageDatas = await NFTActor.GetDatas(Principal.fromText(principalID));
            const name = await NFTActor.GetName(Principal.fromText(principalID));
         
            const dataToPush={
                im : imageDatas,
                name : name
            };
            datas.push(dataToPush);
            //console.log("dataToPush",dataToPush);
        }
    
           
    //console.log("datas",datas);
    SetAllDatas(datas);
       
    }
    
    NftsOwned();
    },[done]);


    if (alldatas === undefined) {
        return <>loading...</>;
    }


    return(
        alldatas.map((NftDatas,index)=>{
            const nft_datas = new Uint8Array(NftDatas.im);
            const nft_image = URL.createObjectURL(new Blob([nft_datas.buffer], {type : "image/png"}));
            const name = NftDatas.name;
        return( <NFTImage key={index} image={nft_image} name={name}/>  );

    })
);
 
        
}


    return (

        <>
        {
    (nftsOwnedIdsArray.length===0)?
    (<h3>You don't own any NFT</h3>)
    :<ShowGallery/>}

            <p>
                your wallet Id {walletId}
            </p>
        </>
    
    );
}




export default NftsGallery;

