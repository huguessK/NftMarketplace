import React, {useState, useEffect, useLayoutEffect } from "react";

import {Principal} from "@dfinity/principal";
import {Actor, HttpAgent} from "@dfinity/agent";

import {idlFactory} from "../../../declarations/nft_backend";
import {nft_backend} from "../../../declarations/nft_backend";

import {token_backend} from "../../../declarations/token_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";

import Chart from "./Chart";

import {UserId} from "../index";

let nftsOwnedIdsArray=[];
let walletId="";




const ShowGallery=(props)=>{
    const [alldatas, SetAllDatas]=useState();
    const [NftsOnsale, SetNftOnsale]=useState();
    const datas =[];

    const [pricesArray, SetP] = useState();
    const promises = props.currentprices; //the selling price of nfts on the marketplae

    useEffect(()=>{
   
      Promise.all(promises).then((values) => {
        SetP(values.reverse());
        //console.log("pricearray",pricesArray);
      });
    },[promises]);

    

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
             const nft_datas = new Uint8Array(NftDatas.im);
             const nft_image = URL.createObjectURL(new Blob([nft_datas.buffer], {type : "image/png"}));
             const name = NftDatas.name;
             const principal = NftDatas.principal;
            
             const currentprice=pricesArray[index]; 
             console.log("currentprice",currentprice);
             console.log("pricearray",pricesArray);
       
        
         if(!(NftsOnsale.includes(principal)) && props.Discover==="0"){
         return( <NFTImage key={index} image={nft_image} name={name} principal={principal} buy={props.buy} sell={props.sell} price="NULL"/>);
         }

         else if((NftsOnsale.includes(principal)) && props.Discover==="0"){
         return( <NFTImage key={index} image={nft_image} name={name} principal={principal} buy="2" sell={props.sell} price="NULL"/>);
         }
         else{
         return( <NFTImage key={index} image={nft_image} name={name} principal={principal} buy="1" sell={props.sell} price={currentprice}/>);
         }
        
     })
 );
       
 }

 


 function NFTImage(props){
    const [price, SetPrice]=useState(0);

    const [hidd, SetHidd]=useState(true);
    const [chart, SetChart]=useState(true);
    const [chartDatas, setChartDatas]=useState([]);

    function runUpdateprice(){
      
   
        async function updateprice(){
            let nftPrincipal = Principal.fromText(props.principal);
            const localHost = "http://localhost:8080/";
            //nft_backend canister ID -> 'dfx canister id nft_backend' in the terminal
            //const id = Principal.fromText(principalID); 
            const agent = new HttpAgent ({host: localHost});
           
            const NFTActor = await Actor.createActor(idlFactory,{
                agent,
                canisterId: nftPrincipal,
            });
        
         let x = document.getElementById("sell"+(props.principal));
         let myprice = x.value; 
         //alert("myprice x.value = " + " " + (myprice));
         NFTActor.SetCurrentPrice(parseFloat(myprice));
         await NFTActor.UpdatePriceHistory(parseFloat(myprice)); //line to remove -- already in function BuyNFT()
        }

        updateprice();
    }
    


function CancelSale(){
    async function functionTorun(){
        await nftmarketplace_backend.cancelSale(Principal.fromText(props.principal));
        //alert("sale cancelled");
        window.location.href="/viewnfts";
    }
    functionTorun();
    
}


function history(){
   
    
    async function functionTorun(){
        let nftPrincipal = Principal.fromText(props.principal);
            const localHost = "http://localhost:8080/";
             //nft_backend canister ID -> 'dfx canister id nft_backend' in the terminal
             //const id = Principal.fromText(principalID); 
             const agent = new HttpAgent ({host: localHost});
             agent.fetchRootKey();
             const NFTActor = await Actor.createActor(idlFactory,{
                 agent,
                 canisterId: nftPrincipal,
             });
        let pricehistory = await NFTActor.PriceHistoryArray();
        //alert(pricehistory);
        setChartDatas(pricehistory);
        /*console.log("chartDatas",chartDatas);
        console.log("pricehistory",pricehistory);*/
    }
    functionTorun();
   
    SetChart(!chart); //toggle the chart display state
}



function BuyNFT(){
    async function Buy(){
        //Change Html inner text : Buy -> Processing
        let innerText = document.getElementById("processing"+(props.principal));
        innerText.innerHTML="Processing...";

        const getsellerId = await nftmarketplace_backend.getSellerId(props.principal); //return a principal
        
        let seller_id_text = getsellerId.toText();
        alert("seller_id" +" "+(seller_id_text));
        let buyer_id_text = UserId;

        let seller = getsellerId;
        let buyer = Principal.fromText(UserId);
        

        let nftPrincipal = Principal.fromText(props.principal);
            const localHost = "http://localhost:8080/";
             //nft_backend canister ID -> 'dfx canister id nft_backend' in the terminal
             //const id = Principal.fromText(principalID); 
             const agent = new HttpAgent ({host: localHost});
             const NFTActor = await Actor.createActor(idlFactory,{
                 agent,
                 canisterId: nftPrincipal,
             });

             let nftprice = await NFTActor.GetCurrentPrice();
             //alert("nft price" + " " + (nftprice));

             let balance = await token_backend.Mybalance(buyer_id_text);
             if(balance>=nftprice)
             {
                let val= await nftmarketplace_backend.BuyNft(Principal.fromText(props.principal),nftprice,seller,buyer);

                //note : balance will not change as seller_id_text=buyer_id_text and nftprice-nftprice=0
                await token_backend.UpdateBalance(seller_id_text, nftprice);
                await token_backend.UpdateBalance(buyer_id_text, -nftprice);
                
                const agent = new HttpAgent ({host: localHost});
                agent.fetchRootKey();
                const NFTActor = await Actor.createActor(idlFactory,{
                    agent,
                    canisterId: nftPrincipal,
                });
                await NFTActor.UpdatePriceHistory(nftprice);
                //alert("nft bought");
                //Change Html inner text : Processing -> Success
                innerText.innerHTML="Success";

                const delay = millis => new Promise((resolve, reject) => {
                    setTimeout(_ => resolve(), millis)
                  });

                await delay(1000);

                window.location.href="/viewnfts";
             }

             else{
                innerText.innerHTML="Failed";
                const delay = millis => new Promise((resolve, reject) => {
                    setTimeout(_ => resolve(), millis)
                  });

                await delay(1000);
                innerText.innerHTML="Buy";
             }
    }
    //Note : if buyer=seller then after buying, nft is totally lost -> not transfer to buyer...This is normal
    Buy();
}



    function handleSubmit(e)  { 
        SetPrice(price);
        async function sell(){
            let nftPrincipal = Principal.fromText(props.principal);
            //alert(props.principal);
            await nftmarketplace_backend.nftTosell(Principal.fromText(UserId), nftPrincipal);
            NftsOnsale.push(props.principal);
            //alert("nft on sale");
            
        }
        
        sell(); 
        runUpdateprice();
        
        //e.preventDefault();
        
    }


    return(
        
        <div className="container">
            <div className="nft">
                    <img src={props.image} alt={props.name} principal={props.principal}></img>
                    <h6>{props.name}</h6>
             {       
                (props.buy==="0")?
                    (
                    <>
                    <form onSubmit={handleSubmit}> 
                    <div hidden={hidd}>
                        {/*<label for="sell">Enter your price</label>*/}
                        <input type="number" placeholder="enter your price" id={"sell"+(props.principal)} name="sell"  min ="0" onBlur={()=>run()} required
                        /><br/>
                        <input type="submit" value="Complete sell"/>
                    </div>  
                    
                    </form>
                    
                    
                    <div  hidden={!hidd}><button onClick={()=>{SetHidd(false)}}>Sell</button></div>

                    </>
                    
                    ) : null
                
            }

            {
                (props.buy==="2")?
                    (<button onClick={()=>CancelSale()}>Cancel sale</button>): null

            }   

            {         
                (props.buy==="1")?
                    (<div>
                        <button id={"processing"+(props.principal)} onClick={()=>BuyNFT()}>Buy</button>
                        <button onClick={()=>history()}>+</button>
                        <p>{props.price} HK</p>
                        
                        { 
                              (!chart)?(
                                <div>
                                <Chart datas={chartDatas}/>
                            </div>
                            ): null
                        }
                                
                          
                       
                    </div>
                    
                   
                    ) : null
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

        <div className="Gallery">
        {
    (nftsOwnedIdsArray.length===0)?
    ((props.Discover==="0")?(<h3>You don't own any NFT</h3>):(<h3>No NFT on sale</h3>))
    :<ShowGallery Discover={props.Discover} buy={props.buy} sell={props.sell} currentprices={props.currentprices}/>}

            <p id="walletId">
                your wallet Id {walletId}
            </p>
        </div>
    
    );
}




export default NftsGallery;

