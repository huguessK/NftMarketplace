import NFTActor "../nft_backend/nft";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug"; //Debug.print(debug_show(varToshow))
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Bool "mo:base/Bool";
import Array "mo:base/Array";


actor HuguesK{


stable var FreeMintCounter  : Nat8 = 0;

//to store nfts owned by each wallet
//Principal -> Owner Principal ID
//Buffer.Buffer<Principal> -> to store each nft owned principal

var NftOwners= HashMap.HashMap<Principal, Buffer.Buffer<Principal>>(1, Principal.equal, Principal.hash);
var NftsToSell= Buffer.Buffer<Principal>(0); //empty buffer

////to make NftOwners and NftsToSell stable
stable var NftsToSellEntries : [Principal] = [];
stable var NftOwnersEntries : List.List<(Principal,List.List<Principal>)> = List.nil<(Principal,List.List<Principal>)>();//empty List


public shared(msg) func mint(name: Text, datas: [Nat8], freemint : Bool) : async () {
    let owner : Principal = msg.caller;
    Debug.print(debug_show(owner));

    Debug.print(debug_show(Cycles.balance()));
    //add experimental cycles in order to be able to mint new nft -- locally
    Cycles.add(500_000_000_000);
    let nft = await NFTActor.NFT(name, datas);
    Debug.print(debug_show(Cycles.balance()));
     Debug.print(debug_show(name));

    /*await nft.SetCurrentPrice(56);
    Debug.print(debug_show(await nft.GetCurrentPrice())); */

    //update NftOwners 
    let buffer =  Buffer.Buffer<Principal>(0);
    buffer.add(await nft.GetID());

    switch (NftOwners.get(owner)) {
            case null {NftOwners.put(owner, buffer);};
            case (?result) {
                for (mynftID in result.vals()){buffer.add(mynftID);};
                NftOwners.put(owner, buffer);};
            };
    if(freemint){
        FreeMintCounter +=1;
    };
    
    };


public query func FreeMintCount() : async Nat8 {
    return FreeMintCounter+1;
};


//return the purchase price of nft
public func BuyNft(nftPrincipal : Principal, price : Float, seller : Principal, buyer : Principal ) : async Float{
    //Remove ownership from the seller
    switch (NftOwners.get(seller)) 
        {
                case null {}; //should never happen
                case (?result) 
                {
                    //remove the NFT from the seller's wallet
                    var newBuffer = Buffer.Buffer<Principal>(0);
                    var buyernftsBuffer = Buffer.Buffer<Principal>(0);
                    for (nftID in result.vals())
                    {
                        if( nftID != nftPrincipal){newBuffer.add(nftID);}
                        else{ 
                            await cancelSale(nftID);
                            //transfer ownership to the buyer
                            buyernftsBuffer.add(nftID);
                            switch (NftOwners.get(buyer)) {
                                case null {}; //should never happen
                                case (?buyernfts){
                                    
                                    for (nftprincipal in buyernfts.vals()){
                                        buyernftsBuffer.add(nftprincipal);
                                    };
                                    //Insert the value v at key k. Overwrites an existing entry with key k
                                    NftOwners.put(buyer, buyernftsBuffer);
                                    }
                                
                                }
                            };
                    };
                NftOwners.put(seller, newBuffer);
             };
        };
    return price; //in order to Update nft price history
};



public query func getSellerId(nftId : Principal) : async Principal {
    Debug.print(debug_show("getSellerId"));
    for (val in NftOwners.entries()){
        let valPair : (Principal,Buffer.Buffer<Principal>) = val;
        let array : [Principal] = Buffer.toArray(valPair.1);
        let find = Array.find<Principal>(array, func x = x == nftId);
        if(find!=null){return valPair.0};
    };

    return Principal.fromText("2vxsx-fae");

};


public query func getOwnedNfts (owner : Principal) : async [Principal] {
    
    switch (NftOwners.get(owner)) {
            case null {
                return []; //empty array
            };
            case (?result) {           
                //Debug.print(debug_show(name));
                return  Buffer.toArray(result);
            };
            };
};


public query func onSale() : async [Principal] {
    
    return  Buffer.toArray(NftsToSell);
};




//if a wallet decide to sell a nft

public func nftTosell(owner : Principal, nftPrincipal : Principal) : async (){
     switch (NftOwners.get(owner)) 
     {
            case null {};
            case (?result) 
            {
                    NftsToSell.add(nftPrincipal);  
        };
     };
     Debug.print(debug_show("Nft placed on sale"));
};

//if the seller cancels the sale of an nft then this nft is removed from the Buffer(NftsToSell)
//nftPrincipal -> the nft concerned
public func cancelSale(nftPrincipal : Principal) : async (){
     
    var newBuffer = Buffer.Buffer<Principal>(0);
    label myforloop for (nftID in NftsToSell.vals())
    {
        if( nftID != nftPrincipal){
            newBuffer.add(nftID);
        }

    };

    NftsToSell.clear();
    NftsToSell :=newBuffer;

};


public shared(msg) func getWalletId() : async Principal{
    return msg.caller;
};



////to make NftOwners and NftsToSell stable

system func preupgrade() {


    NftsToSellEntries := Buffer.toArray(NftsToSell);


    for (val in NftOwners.entries()){
        let valPair : (Principal,Buffer.Buffer<Principal>) = val;
        let bufferToList : List.List<Principal> = List.fromArray(Buffer.toArray(valPair.1));
        let valArray : (Principal, List.List<Principal>) = (valPair.0, bufferToList);
        NftOwnersEntries := List.push(valArray, NftOwnersEntries);
    };
  };

  system func postupgrade() {

     var array = Buffer.Buffer<Principal>(0);
     for ( nftID in NftsToSellEntries.vals()){
        array.add(nftID);
     };
    NftsToSell := array;



     NftOwners := HashMap.HashMap<Principal, Buffer.Buffer<Principal>>(1, Principal.equal, Principal.hash);
      for (val in  List.toIter(NftOwnersEntries)){
        let valPair : (Principal, List.List<Principal>) = val;

        //create a newBuffer and fill it as List.toBuffer method dosen't exist
        var newBuffer = Buffer.Buffer<Principal>(0); 
        for (nftID in List.toIter(valPair.1)){
            newBuffer.add(nftID);
        };

        let valHashmap : (Principal, Buffer.Buffer<Principal>) = (valPair.0, newBuffer);
        NftOwners.put(valHashmap.0, valHashmap.1);
    };

  };




}; //end actor HuguesK


