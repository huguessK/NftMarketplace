import React, {useState, useEffect} from "react";



//css to add ...

function Header() {
    //<BrowserRouter forceRefresh={true}>
  
    return (
        <header>
              <a href="/">
                HuguesK
              </a>
              
              <a href="/discover">
                Discover
              </a>

              <a href="/wallet">
                Wallet
              </a>

              <a href="/viewnfts">
                ViewNfts
              </a>

          </header>
    
    );
  }
  
  export default Header;
  