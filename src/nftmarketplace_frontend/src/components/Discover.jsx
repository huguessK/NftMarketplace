import React, {useState, useEffect} from "react";


import Header from "./Header";
import Footer from "./Footer";



function DiscoverBody (){
    return (
        <p>To do : show the nfts for sale here and allow the purchase if enough tokens in the wallet</p>
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