import React, {useState, useEffect} from "react";

import Header from "./Header";
import Footer from "./Footer";


import {Principal} from "@dfinity/principal";

import {idlFactory} from "../../../declarations/nftmarketplace_backend";
import {nftmarketplace_backend} from "../../../declarations/nftmarketplace_backend";
import NftsGallery from "./NftsGallery";






const freenft =
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


function WalletBody (){
    const [image, SetImage]=useState();
    const [mynft, SetMyNFT]=useState();
    const [nftName, SetNftName]=useState("");
    const [displayNft, setDisplayNft]=useState(false);


   function handleSubmit (e)  { 
       
        async function processing (){

            const imageArray=await image[0].arrayBuffer();
            const imageVectNat8 = [...new Uint8Array(imageArray)];
            Mint(nftName,imageVectNat8, false );
            SetMyNFT(imageVectNat8);

            //console.log(imageVectNat8);
            setDisplayNft(true);
        }
        processing();
        e.preventDefault();
    }

   
    


    async function Mint(nft_name, nftDatasNat8, freemint){
        if(!freemint){
        await nftmarketplace_backend.mint(nft_name,nftDatasNat8, freemint);
        alert("own nft --mint");
        }
        else{
            let FreeMintCounter = await nftmarketplace_backend.FreeMintCount();
            await nftmarketplace_backend.mint("FreeNft #"+(FreeMintCounter),nftDatasNat8, freemint);
            alert("free nft --mint");
        }
    }


    return (
        <>
        <h1>Welcome to wallet body</h1>
        
            <div hidden = {displayNft}>

            <button onClick={()=>Mint("",freenft,true)}>Mint free NFT</button>

            <form onSubmit={handleSubmit} >
            <div>
                <label for="name">Enter a name : my nft #1</label>
                <input type="text" id="nftname" name="name" value={nftName} required
                onChange={e=>SetNftName(e.target.value)}/><br/>
            </div>

            <div>
                <label for="image">Select an image:</label>
                <input type="file" id="image" name="image" accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                required onChange={e=>SetImage(e.target.files)}/><br/>
            </div>

            <div>
            <input type="submit" value="Mint My NFT"/>
            </div>
        </form>
        </div>

        </>  
        
    )
}







function Wallet (){
    return (
        <>
        <Header/>
        <WalletBody/>
        <Footer/>
        </>
    )

}


export default Wallet;