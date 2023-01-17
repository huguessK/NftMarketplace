import React, {useState, useEffect} from "react";

import {Principal} from "@dfinity/principal";
import {Actor, HttpAgent} from "@dfinity/agent";

import {idlFactory} from "../../../declarations/nft_backend";
import {nft_backend} from "../../../declarations/nft_backend";

import {token_backend} from "../../../declarations/token_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";


let nftsOwnedIdsArray=[];
let walletId="";


const ShowGallery=(props)=>{
    const [alldatas, SetAllDatas]=useState();
    const [NftsOnsale, SetNftOnsale]=useState();
    const datas =[];
    
    

    useEffect(()=>{
        async function getNftOnsales(){
            const array = await nftmarketplace_backend.onSale();
            const newarray=[];
            for (const id of array){
                newarray.push(id.toText());
            }
            SetNftOnsale(newarray);
        }
    getNftOnsales();
    console.log("onsales",NftsOnsale);
    },[]);


    useEffect(()=>{
     
     async function NftsOwned(){
     
     
         //console.log("nftsOwned",nftsOwnedIdsArray);
         for (const principalID of nftsOwnedIdsArray.reverse()){
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
                 name : name,
                 principal : principalID
             };
             datas.push(dataToPush);
             //console.log("dataToPush",dataToPush);
         }
     
            
     //console.log("datas",datas);
     SetAllDatas(datas);
        
     }
     
     NftsOwned();
     },[]);
 
 
     if (alldatas === undefined) {
         return <>loading...</>;
     }
 
 
     return(
         alldatas.map((NftDatas,index)=>{
             //const mynfts=[]
             const nft_datas = new Uint8Array(NftDatas.im);
             const nft_image = URL.createObjectURL(new Blob([nft_datas.buffer], {type : "image/png"}));
             const name = NftDatas.name;
             const principal = NftDatas.principal;
             /*mynfts.push({
                id : index,
                name : name,
                im : nft_image
             })*/



         if(!(NftsOnsale.includes(principal))){
         return( <NFTImage key={index} image={nft_image} name={name} principal={principal} buy={props.buy} sell={props.sell}/>);
         }
         return( <NFTImage key={index} image={nft_image} name={name} principal={principal} buy="2" sell={props.sell}/>);
 
     })
 );
  
         
 }



 function NFTImage(props){
    const [price, SetPrice]=useState();

function CancelSale(){
    async function functionTorun(){
        await nftmarketplace_backend.cancelSale(Principal.fromText(props.principal));
        alert("sale cancelled");
    }
    functionTorun();
}

    function handleSubmit (e)  { 
       
        async function sell(){
            await nftmarketplace_backend.nftTosell(Principal.fromText("2vxsx-fae"), Principal.fromText(props.principal));
            NftsOnsale.push(props.principal);
        }
        sell(); 
        //e.preventDefault();
        alert("nft on sale");
    }


    return(
        <div className="flex-container">
            <div className="nft">
                    <img src={props.image} alt={props.name} principal={props.principal}></img>
                    <h6>{props.name}</h6>
             {       
                (props.buy==="0")?
                    (<form onSubmit={handleSubmit}>
                        <label for="sell">Enter your price</label>
                        <input type="text" name="sell" min="0" value={price} required
                        onChange={e=>SetPrice(e.target.value)}/><br/>
                        <input type="submit" value="Sell"/>
                    </form>) : null
                
            }

            {
                (props.buy==="2")?
                    (<button onClick={()=>CancelSale()}>Cancel sale</button>): null

            }   

            {         
                (props.buy==="1")?
                    (<button>Buy</button>) : null
            }
                
                
            

            </div>
            
        </div>
    )
}



function NftsGallery(props){
    nftsOwnedIdsArray = props.nftsOwnedIds;
   
    
    //const walletId = Principal.fromText(props.id);
    walletId = props.id;
    
   
    return (

        <>
        {
    (nftsOwnedIdsArray.length===0)?
    ((props.Discover==="0")?(<h3>You don't own any NFT</h3>):(<h3>No NFT on sale</h3>))
    :<ShowGallery  buy={props.buy} sell={props.sell}/>}

            <p>
                your wallet Id {walletId}
            </p>
        </>
    
    );
}




export default NftsGallery;

