import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug"; //Debug.print(debug_show(varToshow))

actor class NFT(name: Text, datas: [Nat8])=this{


//to record this NFT price history 
var PriceHistory = Buffer.Buffer<Float>(0); // Creates a new Buffer
stable var PriceHistoryEntries : [Float] = []; //useful to make PriceHistory stable


//
stable var currentPrice : Float = 0;



public query func GetName(nftId: Principal) : async Text{
        return name;
};

public query func GetDatas(nftId: Principal) : async [Nat8]{
        return datas;
    
};

public query func GetID() : async Principal {
    return Principal.fromActor(this);
};


public func UpdatePriceHistory(soldPrice : Float) : async (){
Debug.print(debug_show("updatepricehistory"));
 Debug.print(debug_show(soldPrice));
PriceHistory.add(soldPrice);
};

public func PriceHistoryArray() : async [Float] {
    Debug.print(debug_show("PriceHistoryArray"));
    return Buffer.toArray(PriceHistory);
};

public func SetCurrentPrice( price: Float){
 Debug.print(debug_show("setcurrentprice"));
 Debug.print(debug_show(price));
 currentPrice := price;
};

public query func GetCurrentPrice() : async Float {
     Debug.print(debug_show("Getcurrentprice"));
    return currentPrice;
};


//to make PriceHistory stable

system func preupgrade() {
    PriceHistoryEntries := Buffer.toArray(PriceHistory);
  };

  system func postupgrade() {
     PriceHistory := Buffer.Buffer<Float>(0);
     for ( price in PriceHistoryEntries.vals()){
        PriceHistory.add(price);
     }
  };


}//end actor class NFT





