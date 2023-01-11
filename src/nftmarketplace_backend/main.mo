import NFTActor "../nft_backend/nft";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug"; //Debug.print(debug_show(varToshow))
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";


actor HuguesK{

//to store nfts owned by each wallet
//Principal -> Owner Principal ID
//Buffer.Buffer<NFTActor.NFT> -> each nft owned 

var NftOwners= HashMap.HashMap<Principal, Buffer.Buffer<NFTActor.NFT>>(1, Principal.equal, Principal.hash);
var NftsToSell= Buffer.Buffer<NFTActor.NFT>(0); //empty buffer

////to make NftOwners and NftsToSell stable
stable var NftsToSellEntries : [NFTActor.NFT] = [];
stable var NftOwnersEntries : [(Principal,[NFTActor.NFT])] = [];


public shared(msg) func mint(name: Text, datas: [Nat8]) : async () {
    let owner : Principal = msg.caller;

    Debug.print(debug_show(Cycles.balance()));
    //add experimental cycles in order to be able to mint new nft -- locally
    Cycles.add(200_000_000_000);
    let nft = await NFTActor.NFT(name, datas);
    Debug.print(debug_show(Cycles.balance()));

    //update NftOwners 
    let buffer =  Buffer.Buffer<NFTActor.NFT>(0);
    buffer.add(nft);
    NftOwners.put(owner, buffer);
    };



public func BuyNft(nftPrincipal : Principal, price : Float, seller : Principal, buyer : Principal ) : async(){
    //Remove ownership from the seller
    switch (NftOwners.get(seller)) 
        {
                case null {}; //should never happen
                case (?result) 
                {
                    //remove the NFT from the seller's wallet
                    var newBuffer = Buffer.Buffer<NFTActor.NFT>(0);
                    for (nft in result.vals())
                    {
                        let nftID : Principal = await nft.GetID();
                        if( nftID != nftPrincipal){newBuffer.add(nft);}
                        else{ 
                            //transfer ownership to the buyer
                            await nft.UpdatePriceHistory(price);
                            switch (NftOwners.get(buyer)) {
                                case null {}; //should never happen
                                case (?buyernfts){
                                    /************Problem 1/2 to fix*********** line 61*/
                                    NftOwners.put(buyer, buyernfts.add(nft));
                                    }
                                
                                }
                            };
                    };
                NftOwners.put(seller, newBuffer);
             };
        };
};


public query func getOwnedNfts (owner : Principal) : async [NFTActor.NFT] {
    switch (NftOwners.get(owner)) {
            case null {
                return []; //empty buffer
            };
            case (?result) {return  Buffer.toArray(result)};
            };
};

//if a wallet decide to sell a nft

public func nftTosell(owner : Principal, nftPrincipal : Principal) : async (){
     switch (NftOwners.get(owner)) 
     {
            case null {};
            case (?result) 
            {
                //nft search
                label myforloop for (nft in result.vals())
                    {
                        let nftID : Principal = await nft.GetID();
                        if( nftID == nftPrincipal){
                            NftsToSell.add(nft);
                            break myforloop;
                        }
                    };
            };
    };
};

//if the seller cancels the sale of an nft then this nft is removed from the Buffer(NftsToSell)
public func cancelSale(nftPrincipal : Principal) : async (){
     
    var newBuffer = Buffer.Buffer<NFTActor.NFT>(0);
    label myforloop for (nft in NftsToSell.vals())
    {
        let nftID : Principal = await nft.GetID();
        if( nftID != nftPrincipal){
            newBuffer.add(nft);
        }

    };

    NftsToSell.clear();
    NftsToSell :=newBuffer;

};


////to make NftOwners and NftsToSell stable

system func preupgrade() {
    NftsToSellEntries := Buffer.toArray(NftsToSell);
    /************Problem 2/2 to fix*********** line 127*/
    NftOwnersEntries := Iter.toArray(NftOwners.entries());
  };

  system func postupgrade() {
     NftsToSell := Buffer.Buffer<NFTActor.NFT>(0);
     for ( nft in NftsToSellEntries.vals()){
        NftsToSell.add(nft);
     }
  };



}; //end actor HuguesK
